import { Customer } from 'src/customers/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.subscriptions)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn({ name: 'start_date' })
  startDate: Date;

  @Column('date', { name: 'end_date' })
  endDate: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('boolean', { name: 'is_paused', default: false })
  isPaused: boolean;

  @Column()
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  default: Array<Record<string, any>>;

  @Column()
  budget: number;

  @Column({ type: 'jsonb', nullable: true })
  custom: Array<Record<string, any>>;

  @Column()
  time: string;
}
