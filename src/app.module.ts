import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    OrdersModule,
    AppointmentsModule,
    SubscriptionsModule,
    CustomersModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
