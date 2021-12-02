import {
  IsIn,
  IsArray,
  IsUUID,
  IsDateString,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  readonly subscriptionId: string;

  @IsDateString()
  readonly startDate: string;

  @IsDateString()
  readonly endDate: string;

  @IsString()
  readonly userId: string;

  @IsNumber()
  readonly budget: number;

  @IsString()
  readonly isPaused: boolean;

  @IsIn(['orders', 'appointments'])
  readonly type: string;

  @IsArray()
  readonly default: Array<Record<string, any>>;

  @IsArray()
  readonly custom: Array<Record<string, any>>;
}
