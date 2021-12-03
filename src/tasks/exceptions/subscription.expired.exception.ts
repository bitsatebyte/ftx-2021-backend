import { HttpException, HttpStatus } from '@nestjs/common';

export class SubscriptionExpiredException extends HttpException {
  constructor() {
    super('SubscriptionExpired', HttpStatus.FORBIDDEN);
  }
}
