import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Item } from 'src/subscriptions/types/items';
import { BudgetExceededException } from './exceptions/budget.exceeded.exception';
import { SubscriptionExpiredException } from './exceptions/subscription.expired.exception';
import { SubscriptionPausedException } from './exceptions/subscription.paused.exception';
import { OrderStatus } from 'src/orders/types/order.status';

@Injectable()
export class TasksService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly subscriptionsService: SubscriptionsService,
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
        this.orderProcessing(order.id, 'accepted');
        this.orderProcessing(order.id, 'delivered');
      }
    });
  }

  prepareOrderEntity(subscription: Subscription): CreateOrderDto {
    const { customer, custom } = subscription;
    const defaultOrder = subscription.default;
    const restaurant = defaultOrder.restaurant;
    const items: Item[] = [];
    if (!custom) {
      for (const key in defaultOrder.list) {
        items.push(defaultOrder.list[key]);
      }
    } else {
      for (const key in custom.list) {
        items.push(custom.list[key]);
      }
    }
    const order: CreateOrderDto = {
      customer,
      items,
      restaurant,
      total: 300,
      status: 'processing',
    };
    return order;
  }

  handleSubscriptionExceptions(options: Subscription) {
    const { custom, endDate, budget, subscriber } = options;
    const subscriptionEndDate = new Date(endDate).getTime();
    const today = new Date().getTime();
    const hasSubscriptionExpired = subscriptionEndDate <= today;
    // check if subscription has expired
    if (hasSubscriptionExpired || subscriber.status === 'cancelled')
      throw new SubscriptionExpiredException();
    // check if subscription is on pause
    if (subscriber.status === 'paused') throw new SubscriptionPausedException();
    // check if budget has exceeded
    if (custom && custom.total > budget) throw new BudgetExceededException();
  }

  orderProcessing(id: number, status: OrderStatus) {
    setTimeout(() => this.ordersService.update(id, { status }), 2000);
  }
}
