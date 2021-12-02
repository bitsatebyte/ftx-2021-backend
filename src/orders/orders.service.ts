import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    try {
      await this.orderRepository.save(order);
      return createOrderDto;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const orders = await this.orderRepository.find();
      if (!orders) {
        throw new NotFoundException('Order not found');
      }
      return orders;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
