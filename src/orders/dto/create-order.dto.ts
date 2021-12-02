import { IsString, IsArray } from 'class-validator';
export class CreateOrderDto {
  @IsString()
  readonly userId: string;

  @IsArray()
  readonly product: Array<Record<string, number>>;

  @IsString()
  readonly restaurant: string;
}
