import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Customer } from 'src/customers/entities/customer.entity';
import { AppointmentStatus } from '../types/appointment.status.type';
import { Attender } from '../types/attender.type';
import { Establishment } from '../types/establishment.type';

export class CreateAppointmentDto {
  @IsOptional()
  @ValidateNested()
  customer?: Customer;

  @IsDateString()
  readonly date: Date;

  @IsString()
  readonly time: string;

  @IsNumber()
  readonly duration: number;

  @IsOptional()
  @ValidateNested()
  attender?: Attender;

  @ValidateNested()
  readonly establishment: Establishment;

  @IsIn(['processing', 'confirmed', 'cancelled'])
  @IsOptional()
  status?: AppointmentStatus;

  @IsNumber()
  amount: number;
}
