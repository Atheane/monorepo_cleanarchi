import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { KeyVaultConfiguration } from '../../../server/config/EnvConfiguration';

@injectable()
export class BasicAuthMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction): any {
    const { authorization } = request.headers;
    if (!authorization) {
      return response.sendStatus(401);
    }
    const hasGoodKey = authorization.includes(KeyVaultConfiguration.prototype.paymentAuthKey);
    if (!hasGoodKey) {
      return response.sendStatus(403);
    }
    return next();
  }
}
