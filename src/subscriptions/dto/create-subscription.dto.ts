import {
  IsIn,
  IsArray,
  IsDateString,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsDateString()
  @IsOptional()
  readonly endDate: string;

  @IsString()
  readonly userId: string;

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
  readonly customerId: number;
}
