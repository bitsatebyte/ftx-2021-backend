import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DistributorsModule } from './distributors/distributors.module';
import { RetailersModule } from './retailers/retailers.module';

@Module({
  imports: [DistributorsModule, RetailersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
