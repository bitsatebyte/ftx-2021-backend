import { Customer } from 'src/customers/entities/customer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'jsonb' })
  items: Array<Record<string, any>>;

  @Column()
  restaurant: string;

  @Column()
  value: number;

  @Column({ nullable: true })
  description: string;
}
