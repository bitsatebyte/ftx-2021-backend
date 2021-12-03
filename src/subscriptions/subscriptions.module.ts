import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), CustomersModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
