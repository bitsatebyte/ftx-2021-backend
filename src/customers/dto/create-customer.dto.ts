import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly address: string;

  @IsNumber()
  walletBalance: number;
}
