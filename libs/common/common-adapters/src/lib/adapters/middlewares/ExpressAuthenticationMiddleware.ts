import { AuthErrors, DecodeIdentity, Identity } from '@oney/identity-core';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import * as ipaddr from 'ipaddr.js';

@injectable()
export class ExpressAuthenticationMiddleware implements ExpressMiddlewareInterface {
  constructor(private readonly _decodeIdentity: DecodeIdentity) {}

  private extractBearerToken(bearer: string): string {
    if (!bearer) {
      return null;
    }
    return bearer.split(' ')[1].trim();
  }

  async use(request: Request & { user: Identity }, response: Response, next: NextFunction) {
    try {
      const authorization = request.headers['authorization'] as string;
      if (!authorization) {
        return response.sendStatus(401);
      }
      const authToken = this.extractBearerToken(authorization);
      if (!authToken) {
        return response.sendStatus(401);
      }

      const ipAddress = this.parseClientIP(request);

      const identity = await this._decodeIdentity.execute({
        holder: authToken,
        scaHolder: request.headers['sca_token'] as string,
        ...(ipAddress && { ipAddress }),
      });

      try {
        await this._decodeIdentity.canExecute(identity);
      } catch (e) {
        return response.status(401).send({ name: e.name, message: e.message, cause: e.cause });
      }

      request.user = identity;
      return next();
    } catch (e) {
      if (e instanceof AuthErrors.IllegalIdentity || e instanceof AuthErrors.MalformedHolderIdentity) {
        return response.status(498).send({ name: e.name, message: e.message, cause: e.cause });
      }
      return response.status(400).send(e);
    }
  }

  private parseClientIP(req: Request): string {
    let ip: ipaddr.IPv4 | ipaddr.IPv6;

    if (req.headers && typeof req.headers['x-forwarded-for'] === 'string') {
      const clientIP = req.headers['x-forwarded-for'].split(',').shift();
      ip = ipaddr.isValid(clientIP) ? ipaddr.parse(clientIP) : ipaddr.parse(clientIP.split(':').shift());
    } else if (req.ip) {
      ip = ipaddr.parse(req.ip);
    }

    if (ip instanceof ipaddr.IPv4) {
      return ip.toString();
    } else if (ip instanceof ipaddr.IPv6) {
      return ip.isIPv4MappedAddress() && ip.toIPv4Address().toString();
    }
  }
}
