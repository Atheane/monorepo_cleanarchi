import { DecodeIdentity } from '@oney/identity-core';
import { Response } from 'express';
import { injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { UserRequest } from '../../modules/configuration/reqContext/User';

@injectable()
export class UserAuthorizationTokenMiddleware implements ExpressMiddlewareInterface {
  constructor(private readonly _decodeIdentity: DecodeIdentity) {}
  private static extractBearerToken(bearer: string): string {
    if (!bearer) {
      return null;
    }
    return bearer.split(' ')[1].trim();
  }

  async use(req: UserRequest, res: Response, next: Function) {
    try {
      // When sign in userToken not provided.
      if (req.path === '/authentication/sca/verify' && req.method === 'POST') {
        return next();
      }
      const bearerToken = req.headers.authorization as string;

      const authToken = UserAuthorizationTokenMiddleware.extractBearerToken(bearerToken);

      const identity = await this._decodeIdentity.execute({
        holder: authToken,
      });
      try {
        await this._decodeIdentity.canExecute(identity);
      } catch (e) {
        return res.status(401).send({ name: e.name, message: e.message, cause: e.cause });
      }
      req.user = identity;
      return next();
    } catch (e) {
      return res.sendStatus(401);
    }
  }
}
