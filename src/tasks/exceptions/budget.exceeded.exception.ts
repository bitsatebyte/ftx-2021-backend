import { HttpException, HttpStatus } from '@nestjs/common';

export class BudgetExceededException extends HttpException {
  constructor() {
    super('BudgetExceeded', HttpStatus.FORBIDDEN);
  }
}
