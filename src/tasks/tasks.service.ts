import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { BudgetExceededException } from './budget.exceeded.exception';

@Injectable()
export class TasksService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const subscriptions = await this.subscriptionsService.findAll();
    this.logger.debug(`Running cron job`);
    subscriptions.forEach(async (subscription) => {
      const { type } = subscription;
      if (type === 'orders') {
        const orderDto = this.prepareOrderEntity(subscription);
        const order = await this.ordersService.create(orderDto);
        this.logger.log(`Order created: ${JSON.stringify(order)}`);
      }
    });
  }

  prepareOrderEntity(subscription: Subscription): CreateOrderDto {
    const { customer, custom, endDate, budget, time, isPaused } = subscription;
    const defaultOrder = subscription.default;
    this.logger.log(`${JSON.stringify(endDate)}`);
    if (custom[0].price > budget) throw new BudgetExceededException();
    const restaurant = defaultOrder[0].restaurant;
    const order: CreateOrderDto = {
      customer,
      items: defaultOrder,
      restaurant,
      value: 300,
      description: '',
    };
    return order;
  }
}
