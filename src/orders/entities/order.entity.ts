import { Customer } from 'src/customers/entities/customer.entity';
import { Item } from 'src/subscriptions/types/items.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../types/order.status.type';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn({ name: 'created_on' })
  createdOn: Date;

  @Column({ type: 'jsonb' })
  items: Array<Item>;

  @Column()
  restaurant: string;

  @Column()
  total: number;

  @Column()
  status: OrderStatus;

  @Column({ nullable: true })
  description?: string;
}
