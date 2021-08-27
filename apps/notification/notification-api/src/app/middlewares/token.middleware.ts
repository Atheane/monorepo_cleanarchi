import { NextFunction, Response } from 'express';
import { injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { config } from '../config/config.env';
import { verifyToken } from '../services/jwt';

@injectable()
export class AuthorizationTokenMiddleware implements ExpressMiddlewareInterface {
  private extractBearerToken(bearer: string): string {
    if (!bearer) {
      return null;
    }
    return bearer.split(' ')[1].trim();
  }

  async use(request: any, response: Response, next: NextFunction) {
    try {
      const authorization = request.headers['authorization'] as string;
      if (!authorization) {
        return response.sendStatus(401);
      }
      const authToken = this.extractBearerToken(authorization);
      if (!authToken) {
        return response.sendStatus(401);
      }

      request.user = verifyToken(authToken, config.secrets.jwtSecret).payload.user;
      return next();
    } catch (e) {
      return response.sendStatus(500);
    }
  }
}
