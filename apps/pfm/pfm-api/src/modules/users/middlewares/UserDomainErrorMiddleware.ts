import { RbacError, TransactionError } from '@oney/pfm-core';
import * as httpStatus from 'http-status';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@oney/common-core';

@Middleware({ type: 'after' })
@injectable()
export class UserDomainErrorMiddleware implements ExpressErrorMiddlewareInterface {
  public error(error: any, _req: Request, res: Response, next: NextFunction): void {
    if (error instanceof DomainError) {
      let statusCode;
      switch (error.constructor) {
        case TransactionError.AccountNotFound:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case TransactionError.TransactionNotFound:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case TransactionError.InvalidQuery:
          statusCode = httpStatus.BAD_REQUEST;
          break;
        case RbacError.UserCannotRead:
          statusCode = httpStatus.UNAUTHORIZED;
          break;
      }
      res.status(statusCode).send({ name: error.name, message: error.message, cause: error.cause });
      return;
    }
    next(error);
  }
}
