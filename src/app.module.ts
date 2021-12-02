import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    OrdersModule,
    AppointmentsModule,
    SubscriptionsModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
