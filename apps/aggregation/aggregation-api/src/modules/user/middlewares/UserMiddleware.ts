import { NextFunction, Response } from 'express';
import { injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { AuthentifiedRequest } from '../../middlewares/types';

@injectable()
export class UserMiddleware implements ExpressMiddlewareInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use(request: AuthentifiedRequest, response: Response, next: NextFunction): any {
    if (request.user.uid !== request.params.userId) {
      return response.sendStatus(401);
    }
    return next();
  }
}
