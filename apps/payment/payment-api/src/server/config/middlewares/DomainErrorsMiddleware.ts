import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { DomainError } from '@oney/common-core';
import { AuthenticationError, BankAccountError, CardError, NetworkError } from '@oney/payment-core';

@Middleware({ type: 'after' })
@injectable()
export class DomainErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof DomainError) {
      let statusCode: number;
      switch (err.constructor) {
        case CardError.UserNotFound:
          statusCode = 404;
          break;
        case BankAccountError.BankAccountNotFound:
          statusCode = 404;
          break;
        case NetworkError.ApiResponseError:
          if (err.cause.apiErrorReason && err.cause.apiErrorReason.error === 'invalid_client') {
            statusCode = 401;
            break;
          }
          if (err.cause.status) {
            statusCode = err.cause.status;
            break;
          }
          statusCode = 500;
          break;
        case CardError.InvalidAtmWeeklyAllowance:
          statusCode = 400;
          break;
        case CardError.InvalidMonthlyAllowance:
          statusCode = 400;
          break;
        case AuthenticationError.Forbidden:
          statusCode = 403;
          break;
        default:
          statusCode = 500;
      }

      res.status(statusCode).send({ error: err.name, message: err.message, cause: err.cause });

      return next();
    } else if (err.name === 'BadRequestError') {
      res.status(400).send(err);
      return next();
    }

    res.status(500).send(err);
    return next();
  }
}
