import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersService } from 'src/customers/customers.service';
import { Customer } from 'src/customers/entities/customer.entity';
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
  private readonly logger: Logger = new Logger(SubscriptionsService.name);

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { customerId } = createSubscriptionDto;
    const customer = await this.customersService.findOne(customerId);
    // check if subscription already exists
    this.handleDuplicateSubscription(customer, createSubscriptionDto);
    createSubscriptionDto.customer = customer;
    const now = new Date();
    if (customer.walletBalance < createSubscriptionDto.budget) {
      throw new NotAcceptableException(
        `Wallet balance is low! Please recharge`,
      );
    }
    const updatedWalletBalance =
      customer.walletBalance - createSubscriptionDto.budget;
    this.customersService.update(customerId, {
      walletBalance: updatedWalletBalance,
    });
    // set the end date to 90 days from now
    createSubscriptionDto.endDate = new Date(
      now.setDate(now.getDate() + 90),
    ).toLocaleDateString();
    createSubscriptionDto.subscriber = 'active';
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
      try {
        this.handleSubscriptionExceptions(subscription);
      } catch (error) {
        throw new NotAcceptableException(error.message);
      }
      await this.subscriptionRepository.update(id, updateSubscriptionDto);
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  handleSubscriptionExceptions(subscription: Subscription): void {
    try {
      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }
      if (subscription.subscriber === 'cancelled') {
        throw new ForbiddenException('Subscription is cancelled');
      }
    } catch (e) {
      throw new NotAcceptableException(e.message);
    }
  }

  handleDuplicateSubscription(
    customer: Customer,
    subscription: CreateSubscriptionDto,
  ) {
    const { subscriptions } = customer;
    const isDuplicate = subscriptions.find(
      (sub) =>
        sub.subscriptionType === subscription.subscriptionType &&
        sub.subscriber !== 'cancelled',
    );
    if (isDuplicate)
      throw new NotAcceptableException('Subscription already exists');
  }

  remove(id: string) {
    return `This action removes a #${id} subscription`;
  }
}
