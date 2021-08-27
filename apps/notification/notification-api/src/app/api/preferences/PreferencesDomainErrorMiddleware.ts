import { DomainError } from '@oney/common-core';
import { Request, Response, NextFunction } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { RecipientError } from '../../domain/models/DomainError';

@Middleware({ type: 'after' })
@injectable()
export class PreferencesDomainErrorMiddleware implements ExpressErrorMiddlewareInterface {
  public error(error: unknown, _req: Request, res: Response, next: NextFunction): Response {
    if (error instanceof DomainError) {
      let statusCode: number;
      switch (error.constructor) {
        case RecipientError.RecipientNotFound:
          statusCode = httpStatus.NOT_FOUND;
          break;
      }
      return res.status(statusCode).send({ error: error.name, message: error.message, cause: error.cause });
    }
    next(error);
  }
}
