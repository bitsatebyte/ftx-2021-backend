import {
  IsIn,
  IsDateString,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
import { AppointmentItem } from '../../appointments/types/appointment.type';
import { Items } from '../types/items.type';
import { Status } from '../types/status.type';
import { subscriptionType } from '../types/subscription.type';

export class CreateSubscriptionDto {
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  readonly budget: number;

  @IsOptional()
  subscriber?: Status;

  @IsIn(['order', 'appointment'])
  readonly subscriptionType: subscriptionType;

  @ValidateNested()
  readonly default: Items | AppointmentItem;

  @ValidateNested()
  @IsOptional()
  readonly custom: Items | AppointmentItem;

  @IsNumber()
  customerId: number;

  @IsOptional()
  customer: Customer;

  @IsString()
  readonly time: string;
}
