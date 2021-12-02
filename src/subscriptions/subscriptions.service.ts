import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersService } from 'src/customers/customers.service';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly customersService: CustomersService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { customerId } = createSubscriptionDto;
    const customer = await this.customersService.findOne(customerId);
    delete createSubscriptionDto.customerId;
    createSubscriptionDto.customer = customer;
    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    try {
      await this.subscriptionRepository.save(subscription);
      return createSubscriptionDto;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const subscriptions = await this.subscriptionRepository.find();
      if (!subscriptions) {
        throw new NotFoundException('Subscription not found');
      }
      return subscriptions;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const subscription = this.subscriptionRepository.findOne(id);
      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }
      return subscription;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      await this.subscriptionRepository.update(id, updateSubscriptionDto);
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} subscription`;
  }
}
