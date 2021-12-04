import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
import { Item } from 'src/subscriptions/types/items.type';
import { OrderStatus } from '../types/order.status.type';
export class CreateOrderDto {
  @IsOptional()
  @ValidateNested()
  customer?: Customer;

  @IsArray()
  readonly items: Array<Item>;

  @IsString()
  readonly restaurant: string;

  @IsNumber()
  readonly total: number;

  @IsString()
  @IsIn(['processing', 'accepted', 'delivered', 'cancelled'])
  status: OrderStatus;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
