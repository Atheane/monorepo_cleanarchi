import { ValidationError } from 'class-validator';
import * as express from 'express';
import { injectable } from 'inversify';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';

/* istanbul ignore next */
@Middleware({ type: 'after' })
@injectable()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(error: any, _req: express.Request, res: express.Response) {
    const responseObject = {} as any;

    // if its an array of ValidationError
    if (Array.isArray(error) && error.every(element => element instanceof ValidationError)) {
      res.status(400);
      responseObject.message =
        "You have an error in your request's body. Check 'errors' field for more details!";
      responseObject.errors = error;
    } else {
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

    // send json only with error
    res.json(responseObject);
  }
}
