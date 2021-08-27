import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { DomainError } from '@oney/common-core';
import { Response, ErrorRequestHandler, Request } from 'express';
import { injectable } from 'inversify';

@injectable()
@Middleware({ type: 'after' })
export class DomainErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: ErrorRequestHandler, request: Request, response: Response): Response | void {
    if (error instanceof DomainError) {
      return response.status(400).send({
        message: error.message,
        name: error.name,
      });
    }
    return response.status(400).send(error);
  }
}
