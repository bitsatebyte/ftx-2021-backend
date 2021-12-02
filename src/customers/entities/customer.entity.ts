import { Order } from 'src/orders/entities/order.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToMany(() => Subscription, (subscription) => subscription.customer)
  subscriptions: Array<Subscription>;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Array<Order>;
}
