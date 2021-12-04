import { AppointmentItem } from 'src/appointments/types/appointment.type';
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
import { Items } from '../types/items.type';
import { Status } from '../types/status.type';
import { subscriptionType } from '../types/subscription.type';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.subscriptions, {
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn({ name: 'start_date' })
  startDate: Date;

  @Column('date', { name: 'end_date' })
  endDate: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('jsonb')
  subscriber: Status;

  @Column({ name: 'subscription_type' })
  subscriptionType: subscriptionType;

  @Column({ type: 'jsonb', nullable: true })
  default?: Items | AppointmentItem;

  @Column()
  budget: number;

  @Column({ type: 'jsonb', nullable: true })
  custom?: Items | AppointmentItem;

  @Column()
  time: string;
}
