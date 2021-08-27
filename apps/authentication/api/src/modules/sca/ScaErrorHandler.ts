import { AuthenticationError } from '@oney/authentication-core';
import { DomainError } from '@oney/common-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { HttpError } from 'routing-controllers';

export class ScaErrorHandler {
  static requestAuthError(error, res: Response) {
    switch (true) {
      case error instanceof AuthenticationError.AuthInitTooManyAuthSessionsForUser: {
        const { safeMessage, cause } = error as AuthenticationError.AuthInitTooManyAuthSessionsForUser;
        const httpException = new HttpError(httpStatus.TOO_MANY_REQUESTS, safeMessage);
        return res.status(httpException.httpCode).json({
          code: httpException.httpCode,
          type: safeMessage,
          message: cause.msg,
          uid: cause.uid,
        });
      }
      case error instanceof AuthenticationError.AuthInitUnknownUser: {
        const { safeMessage, cause } = error as AuthenticationError.AuthInitUnknownUser;
        const notFoundException = new HttpError(httpStatus.NOT_FOUND, safeMessage);

        return res.status(notFoundException.httpCode).send({
          code: notFoundException.httpCode,
          type: safeMessage,
          message: cause.msg,
          uid: cause.uid,
        });
      }
      case error instanceof AuthenticationError.AuthInitAuthenticationLocked: {
        const { safeMessage, cause } = error as AuthenticationError.AuthInitAuthenticationLocked;
        const locked = 423;

        return res.status(locked).send({
          code: locked,
          type: safeMessage,
          message: cause.msg,
          uid: cause.uid,
          unblockingDate: cause.unlockingDate,
        });
      }
      default: {
        const defaultError = error as DomainError;
        const statusCode = httpStatus.BAD_REQUEST;

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        process.env.NODE_ENV !== 'production' &&
          console.log(
            `[ ERROR ] ${JSON.stringify({
              message: defaultError.message,
              location: defaultError.stack.split('at')[1].replace('\n', '').split('(')[0].trim(),
            })}`,
          );

        res.status(statusCode).send({
          code: statusCode,
          type: defaultError.name
            .replace(/[A-Z]/g, letter => (defaultError.name.indexOf(letter) !== 0 ? `_${letter}` : letter))
            .toUpperCase(),
          message: 'An error occurred. Please try later',
          reason: defaultError.message,
        });
      }
    }
  }
}
