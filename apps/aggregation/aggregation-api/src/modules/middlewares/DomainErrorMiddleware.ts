import { DomainError } from '@oney/common-core';
import {
  BankConnectionError,
  BankError,
  RbacError,
  TermsError,
  UserError,
  BankAccountError,
  CreditDecisioningError,
} from '@oney/aggregation-core';
import { Request, Response, NextFunction } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'after' })
@injectable()
export class DomainErrorMiddleware implements ExpressErrorMiddlewareInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(error: Error, _req: Request, res: Response, next: NextFunction): Response {
    if (error instanceof DomainError) {
      let statusCode;
      switch (error.constructor) {
        case BankError.BankNotFound:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case BankConnectionError.BankConnectionNotFound:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case BankConnectionError.ActionNeeded:
          statusCode = httpStatus.BAD_REQUEST;
          break;
        case BankConnectionError.WrongPassword:
          statusCode = httpStatus.BAD_REQUEST;
          break;
        case BankConnectionError.NoScaRequired:
          statusCode = httpStatus.BAD_REQUEST;
          break;
        case BankConnectionError.StateUnknown:
          statusCode = httpStatus.BAD_REQUEST;
          break;
        case BankConnectionError.FieldValidationFailure:
          statusCode = httpStatus.BAD_REQUEST;
          break;
        case BankConnectionError.ApiResponseError:
          statusCode = httpStatus.FAILED_DEPENDENCY;
          break;
        case TermsError.DocumentNotFound:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case UserError.UserUnknown:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case BankAccountError.BankAccountNotFound:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case BankAccountError.FieldValidationFailure:
          statusCode = httpStatus.BAD_REQUEST;
          break;
        case BankAccountError.NoAggregatedAccounts:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case CreditDecisioningError.UserUnknown:
          statusCode = httpStatus.NOT_FOUND;
          break;
        case CreditDecisioningError.ApiResponseError:
          statusCode = httpStatus.FAILED_DEPENDENCY;
          break;
        case CreditDecisioningError.TransactionsAlreadyPosted:
          statusCode = httpStatus.BAD_REQUEST;
          break;
        case RbacError.UserCannotRead:
          statusCode = httpStatus.UNAUTHORIZED;
          break;
        case RbacError.UserCannotWrite:
          statusCode = httpStatus.UNAUTHORIZED;
          break;
      }
      return res.status(statusCode).send({ error: error.name, code: error.message, cause: error.cause });
    }

    next(error);
  }
}
