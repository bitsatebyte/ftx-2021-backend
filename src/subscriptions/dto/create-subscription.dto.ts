import {
  IsIn,
  IsArray,
  IsDateString,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';

export class CreateSubscriptionDto {
  @IsDateString()
  @IsOptional()
  readonly endDate: string;

  @IsNumber()
  readonly budget: number;

  @IsString()
  @IsOptional()
  readonly isPaused: boolean;

  @IsIn(['orders', 'appointments'])
  readonly type: string;

  @IsArray()
  readonly default: Array<Record<string, any>>;

  @IsArray()
  @IsOptional()
  readonly custom: Array<Record<string, any>>;

  @IsOptional()
  @IsNumber()
  customerId: number;

  @IsOptional()
  customer: Customer;

  @IsString()
  readonly time: string;
}
