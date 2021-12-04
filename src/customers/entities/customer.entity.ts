import { Appointment } from 'src/appointments/entities/appointment.entity';
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

  @Column({ name: 'wallet_balance' })
  walletBalance: number;

  @OneToMany(() => Subscription, (subscription) => subscription.customer)
  subscriptions: Array<Subscription>;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Array<Order>;

  @OneToMany(() => Appointment, (order) => order.customer)
  appointments: Array<Appointment>;
}
