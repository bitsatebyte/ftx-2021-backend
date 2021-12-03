import {
  IsIn,
  IsDateString,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
import { Items } from '../types/items';
import { Status } from '../types/status';
import { subscriptionType } from '../types/subscription.type';

export class CreateSubscriptionDto {
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  readonly budget: number;

  @IsOptional()
  @ValidateNested()
  subscriber?: Status;

  @IsIn(['order', 'appointment'])
  readonly subscriptionType: subscriptionType;

  @ValidateNested()
  readonly default: Items;

  @ValidateNested()
  @IsOptional()
  readonly custom: Items;

  @IsNumber()
  customerId: number;

  @IsOptional()
  customer: Customer;

  @IsString()
  readonly time: string;
}
