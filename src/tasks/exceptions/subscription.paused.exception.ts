import { HttpException, HttpStatus } from '@nestjs/common';

export class SubscriptionPausedException extends HttpException {
  constructor() {
    super('SubscriptionPaused', HttpStatus.FORBIDDEN);
  }
}
