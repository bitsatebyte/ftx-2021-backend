import { Customer } from 'src/customers/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentStatus } from '../types/appointment.status.type';
import { Attender } from '../types/attender.type';
import { Establishment } from '../types/establishment.type';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.appointments)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on' })
  updatedOn: Date;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column()
  duration: number;

  @Column('jsonb')
  establishment: Establishment;

  @Column('jsonb', { nullable: true })
  attender: Attender;

  @Column()
  status: AppointmentStatus;

  @Column()
  amount: number;
}
