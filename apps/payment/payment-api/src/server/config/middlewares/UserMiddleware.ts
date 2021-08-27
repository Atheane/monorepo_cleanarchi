import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { AuthentifiedRequest } from './types/AuthentifiedRequest';

@injectable()
export class UserMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction): any {
    const req = request as AuthentifiedRequest;
    const { uid } = req.user;

    if (uid !== request.params.uid) {
      return response.sendStatus(401);
    }
    return next();
  }
}
