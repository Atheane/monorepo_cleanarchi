import { Response, Request } from 'express';
import { injectable } from 'inversify';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { UsingBasicAuthUriPath } from '../UsingBasicAuthUriPath';
import { envConfiguration } from '../../../config/server/Envs';

@injectable()
export class BasicAuthMiddleware implements ExpressMiddlewareInterface {
  private static extractBearerToken(basic: string): string {
    if (!basic) {
      return null;
    }
    return basic.split(' ')[1].trim();
  }

  async use(req: Request, res: Response, next: Function) {
    const basicAuthToken = req.headers.authorization as string;
    const authKey = BasicAuthMiddleware.extractBearerToken(basicAuthToken);

    if (!authKey) {
      return res.sendStatus(401);
    }

    const requestUrlPath = req.url;

    // restrict token to particular url

    const provisionPhoneUrlKey = UsingBasicAuthUriPath.PROVISION_PHONE.replace('/:uid', '');
    const provisionCardUrlKey = UsingBasicAuthUriPath.PROVISION_CARD.replace('/:uid', '');

    const authTokenMap = new Map([
      [provisionPhoneUrlKey, envConfiguration.getKeyvaultSecret().basicAuthKey],
      [UsingBasicAuthUriPath.ONEY_TOKEN_KEYS, envConfiguration.getKeyvaultSecret().basicAuthKey],
      [provisionCardUrlKey, envConfiguration.getKeyvaultSecret().basicRefAuthKey],
    ]);

    const restrictedPaths = [
      provisionPhoneUrlKey,
      provisionCardUrlKey,
      UsingBasicAuthUriPath.ONEY_TOKEN_KEYS,
    ];

    for (const rPath of restrictedPaths) {
      if (requestUrlPath.endsWith(rPath)) {
        if (authKey !== authTokenMap.get(rPath)) {
          return res.sendStatus(401);
        }
        break;
      }
    }

    return next();
  }
}
