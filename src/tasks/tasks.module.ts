import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [SubscriptionsModule, OrdersModule],
  providers: [TasksService],
})
export class TasksModule {}
