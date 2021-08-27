import { ExpressMiddlewareInterface } from 'routing-controllers';
import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { AuthentifiedRequest } from '../../../config/middlewares/types/AuthentifiedRequest';

@injectable()
export class UserMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction): any {
    const req = request as AuthentifiedRequest;
    const { uid } = req.user;

    if (uid !== request.params.userId) {
      return response.sendStatus(401);
    }
    return next();
  }
}
