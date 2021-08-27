import { HttpError, Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { ValidationError } from 'class-validator';
import * as express from 'express';
import { injectable } from 'inversify';

/* istanbul ignore next */
@Middleware({ type: 'after' })
@injectable()
export class CustomErrorMiddleware implements ExpressErrorMiddlewareInterface {
  public error(error: any, _req: express.Request, res: express.Response) {
    const responseObject = {} as any;
    if (
      error.errors &&
      Array.isArray(error.errors) &&
      error.errors.every(element => element instanceof ValidationError)
    ) {
      res.status(400);
      responseObject.message =
        "You have an error in your request's body. Check 'errors' field for more details!";
      responseObject.errors = error.errors;
    } else {
      // send json only with error
      // set http status
      if (error instanceof HttpError && error.httpCode) {
        res.status(error.httpCode);
      } else {
        res.status(500);
      }

      if (error instanceof Error) {
        const developmentMode: boolean = process.env.NODE_ENV === 'development';

        // set response error fields
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

    return res.send(responseObject);
  }
}
