import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Item, Items } from 'src/subscriptions/types/items.type';
import { BudgetExceededException } from './exceptions/budget.exceeded.exception';
import { SubscriptionExpiredException } from './exceptions/subscription.expired.exception';
import { SubscriptionPausedException } from './exceptions/subscription.paused.exception';
import { OrderStatus } from 'src/orders/types/order.status.type';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { CreateAppointmentDto } from 'src/appointments/dto/create-appointment.dto';
import { AppointmentItem } from 'src/appointments/types/appointment.type';
import { Establishment } from 'src/appointments/types/establishment.type';
import { isEmpty } from 'lodash';

@Injectable()
export class TasksService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCreateOrderCron() {
    const subscriptions = await this.subscriptionsService.findAll();
    if (!subscriptions.length) return;
    subscriptions.forEach(async (subscription) => {
      const { subscriptionType } = subscription;
      this.handleSubscriptionExceptions(subscription);
      if (subscriptionType === 'order') {
        const orderDto = this.prepareOrderEntity(subscription);
        // log order placing event
        this.logger.log(`Placing the order`);
        const order = await this.ordersService.create(orderDto);
        // calculate remaining budget
        const budget = subscription.budget - order.total;
        // update the budget and set the custom order to null
        await this.subscriptionsService.update(subscription.id, {
          budget,
          custom: null,
        });
        // emit order created event to frontend
        // this.socket.emit('order.create', { order });

        // run order processing events
        await this.orderProcessing(order.id, 'accepted');
        await this.orderProcessing(order.id, 'delivered');
      }
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCreateAppointmentCron() {
    const subscriptions = await this.subscriptionsService.findAll();
    if (!subscriptions.length) return;
    subscriptions.forEach(async (subscription) => {
      const { subscriptionType } = subscription;
      try {
        this.handleSubscriptionExceptions(subscription);
      } catch (error) {
        this.logger.error(error.message);
        throw new NotAcceptableException(error.message);
      }
      if (subscriptionType === 'appointment') {
        const appointmentDto = this.prepareAppointmentEntity(subscription);
        // log appointment placing event
        this.logger.log(`booking the appointment`);
        const appointment = await this.appointmentsService.create(
          appointmentDto,
        );
        // calculate remaining budget
        const budget = subscription.budget - appointmentDto.amount;
        // update the budget and set the custom order to null
        await this.subscriptionsService.update(subscription.id, {
          budget,
          custom: null,
        });
        // emit appointment created event to frontend
        // this.socket.emit('appointment.create', { appointment });
      }
    });
  }

  prepareOrderEntity(subscription: Subscription): CreateOrderDto {
    let { customer, custom } = subscription;
    let defaultOrder = subscription.default;
    custom = custom as Items;
    defaultOrder = defaultOrder as Items;
    let restaurant = defaultOrder.restaurant;
    const items: Item[] = [];
    if (!custom) {
      for (const key in defaultOrder.list) {
        items.push(defaultOrder.list[key]);
      }
    } else {
      for (const key in custom.list) {
        items.push(custom.list[key]);
      }
      restaurant = custom.restaurant;
    }
    const order = {
      customer,
      items,
      restaurant,
      total: 300,
      status: 'processing' as OrderStatus,
    };

    return order;
  }

  prepareAppointmentEntity(subscription: Subscription): CreateAppointmentDto {
    let { customer, custom, time } = subscription;
    let defaultAppointment = subscription.default;
    custom = custom as AppointmentItem;
    defaultAppointment = defaultAppointment as AppointmentItem;
    let establishment: Establishment, amount: number;
    if (!custom) {
      establishment = defaultAppointment.establishment;
      amount = defaultAppointment.total;
    } else {
      establishment = custom.establishment;
      amount = custom.total;
    }
    const appointment: CreateAppointmentDto = {
      customer,
      establishment,
      time,
      amount,
      date: new Date(),
      duration: 60,
    };

    return appointment;
  }

  handleSubscriptionExceptions(options: Subscription) {
    const { endDate, budget, subscriber } = options;
    const custom = options.custom as Items;
    const defaultOrder = options.default;
    const subscriptionEndDate = new Date(endDate).getTime();
    const today = new Date().getTime();
    const hasSubscriptionExpired = subscriptionEndDate <= today;
    try {
      // check if subscription has expired
      if (hasSubscriptionExpired || subscriber === 'cancelled')
        throw new SubscriptionExpiredException();
      // check if subscription is on pause
      if (subscriber === 'paused') throw new SubscriptionPausedException();
      // check if budget has exceeded
      if (
        (!isEmpty(custom) && custom.total > budget) ||
        defaultOrder.total > budget
      ) {
        this.subscriptionsService.update(options.id, {
          subscriber: 'cancelled',
        });
      }
    } catch (e) {
      throw new NotAcceptableException(e.message);
    }
  }

  async orderProcessing(id: number, status: OrderStatus) {
    setTimeout(() => this.ordersService.update(id, { status }), 2000);
  }
}
