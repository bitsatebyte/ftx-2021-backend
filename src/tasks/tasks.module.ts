import { Module } from '@nestjs/common';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { OrdersModule } from 'src/orders/orders.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [SubscriptionsModule, OrdersModule, AppointmentsModule],
  providers: [TasksService],
})
export class TasksModule {}
