import { NextFunction, Response } from 'express';
import { injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';

@injectable()
export class UserMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: Response, next: NextFunction): any {
    const { uid } = request.user;

    if (uid !== request.params.uid) {
      return response.sendStatus(401);
    }
    return next();
  }
}
