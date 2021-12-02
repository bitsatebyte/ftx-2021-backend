import { Module } from '@nestjs/common';
import { RetailersService } from './retailers.service';
import { RetailersController } from './retailers.controller';

@Module({
  controllers: [RetailersController],
  providers: [RetailersService]
})
export class RetailersModule {}
