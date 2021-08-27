import { HttpException, HttpStatus } from '@nestjs/common';

export class ScaException extends HttpException {
  cause: any;
  constructor(e) {
    super(e, HttpStatus.FORBIDDEN);
    if (e.cause) {
      this.cause = e.cause;
    }
  }
}
