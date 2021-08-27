import { PingAuth, PingRefAuth } from '@oney/authentication-core';
import { DomainError } from '@oney/common-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, QueryParam, Res } from 'routing-controllers';
import { envConfiguration } from '../../config/server/Envs';

@JsonController('')
@injectable()
export class HealthCheckController {
  constructor(private readonly _pingRefAuth: PingRefAuth, private readonly _pingAuth: PingAuth) {}

  @Get('/status')
  async controlHealthCheck(@Res() res: Response) {
    return res.sendStatus(httpStatus.OK);
  }

  @Get('/ping')
  async controlPing(@Res() res: Response) {
    return res.sendStatus(httpStatus.OK);
  }

  /**
   *  Ping RefAuth service (used for provisioning)
   * @param authToken
   * @param res
   */
  /* istanbul ignore next: We ignore this test case because we have to be connected on app service. */
  @Get('/status/icg/refauth')
  async pingRefauthIcg(@QueryParam('token') authToken: string, @Res() res: Response) {
    try {
      if (decodeURIComponent(authToken) !== envConfiguration.getKeyvaultSecret().refAuthHealthCheckKey) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }

      const result = await this._pingRefAuth.execute();
      if (result) {
        return res.sendStatus(httpStatus.OK);
      }
    } catch (e) {
      if (e instanceof DomainError) {
        return res.status(httpStatus.BAD_REQUEST).send(e.cause);
      }
      console.log(e);
      return res.status(500).send(e);
    }
  }

  /**
   *  Ping Authentication service
   * @param authToken
   * @param res
   */
  /* istanbul ignore next: We ignore this test case because we have to be connected on app service. */
  @Get('/status/icg/auth')
  async pingAuthIcg(@QueryParam('token') authToken: string, @Res() res: Response) {
    try {
      if (decodeURIComponent(authToken) !== envConfiguration.getKeyvaultSecret().authHealthCheckKey) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }

      const result = await this._pingAuth.execute();

      if (result) {
        return res.sendStatus(httpStatus.OK);
      }
    } catch (e) {
      if (e instanceof DomainError) {
        return res.status(httpStatus.BAD_REQUEST).send(e.cause);
      }
      console.log(e);
      return res.status(500).send(e);
    }
  }
}
