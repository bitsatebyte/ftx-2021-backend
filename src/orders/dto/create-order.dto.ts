import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  @IsOptional()
  @ValidateNested()
  customer: Customer;

  @IsArray()
  readonly items: Array<Record<string, number>>;

  @IsString()
  readonly restaurant: string;

  @IsNumber()
  readonly value: number;

  @IsOptional()
  @IsString()
  readonly description: string;
}
