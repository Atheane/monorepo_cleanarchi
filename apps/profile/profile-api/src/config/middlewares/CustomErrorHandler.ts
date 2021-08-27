import { GenericError } from '@oney/common-core';
import { ProfileErrors, TipsErrors, DocumentErrors } from '@oney/profile-core';
import { ValidationError } from 'class-validator';
import * as express from 'express';
import { injectable } from 'inversify';
import { HttpError, Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import ApiResponseError = GenericError.ApiResponseError;

/* istanbul ignore next */
@Middleware({ type: 'after' })
@injectable()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(error: any, _req: express.Request, res: express.Response) {
    const responseObject = {} as any;
    if (Array.isArray(error.errors) && error.errors.every(element => element instanceof ValidationError)) {
      res.status(400);
      responseObject.message =
        "You have an error in your request's body. Check 'errors' field for more details!";
      responseObject.errors = error.errors;
    } else {
      res.status(500);

      if (error instanceof TipsErrors.IfCaseNotImplemented) {
        res.status(404);
      }

      if (error instanceof TipsErrors.NoTipsForUser) {
        res.status(404);
      }

      if (error instanceof ApiResponseError && error.cause.status) {
        res.status(error.cause.status);
        error.message = error.cause.apiErrorReason;
      }

      if (error instanceof ProfileErrors.ProfileNotFound) {
        res.status(404);
      }

      if (error instanceof DocumentErrors.DocumentNotFound) {
        res.status(404);
      }

      if (error instanceof HttpError && error.httpCode) {
        res.status(error.httpCode);
      }

      // Specific to migrated legacy errors needed for the frontend
      if (error.code) {
        res.status(400);
        responseObject.code = error.code;
      }

      if (error instanceof Error) {
        const developmentMode: boolean = process.env.NODE_ENV === 'development';

        if (error.name && (developmentMode || error.message)) {
          responseObject.name = error.name;
        }
        if (error.message) {
          responseObject.message = error.message;
        }
        if (error.stack && developmentMode) {
          responseObject.stack = error.stack;
        }
      } else if (typeof error === 'string') {
        responseObject.message = error;
      }
    }
    res.json(responseObject);
  }
}
