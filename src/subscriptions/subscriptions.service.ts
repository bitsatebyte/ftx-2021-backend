import {
  BadRequestException,
  ForbiddenException,
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
    createSubscriptionDto.customer = customer;
    const now = new Date();
    // set the end date to 90 days from now
    createSubscriptionDto.endDate = new Date(
      now.setDate(now.getDate() + 90),
    ).toLocaleDateString();
    createSubscriptionDto.subscriber = { status: 'active', id: 1 };
    delete createSubscriptionDto.customerId;
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
      return subscriptions;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const subscription = this.subscriptionRepository.findOne(id);
      return subscription;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const subscription = await this.subscriptionRepository.findOne(id);
      this.handleSubscriptionExceptions(subscription);
      await this.subscriptionRepository.update(id, updateSubscriptionDto);
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  handleSubscriptionExceptions(subscription: Subscription): void {
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    if (subscription.subscriber.status === 'cancelled') {
      throw new ForbiddenException('Subscription is cancelled');
    }
  }

  remove(id: string) {
    return `This action removes a #${id} subscription`;
  }
}
