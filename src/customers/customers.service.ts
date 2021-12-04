import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    try {
      await this.customerRepository.save(customer);
      return createCustomerDto;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const customers = await this.customerRepository.find({
        relations: ['subscriptions', 'orders'],
      });
      if (!customers) {
        throw new NotFoundException('Subscription not found');
      }
      return customers;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number) {
    try {
      const customer = this.customerRepository.findOne(id, {
        relations: ['subscriptions', 'orders'],
      });
      if (!customer) {
        throw new NotFoundException('Subscription not found');
      }
      return customer;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      await this.customerRepository.update(id, updateCustomerDto);
      return true;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
