import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { GetTips } from '@oney/profile-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Get, JsonController, Param, Req, Res, UseBefore } from 'routing-controllers';
import { AuthentifiedRequest } from '../../config/middlewares/types/AuthentifiedRequest';

@JsonController('/tips')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class TipsController {
  constructor(private readonly _getTips: GetTips) {}

  @Get('/:uid')
  async getTips(@Param('uid') userId: string, @Res() res: Response, @Req() req: AuthentifiedRequest) {
    const isAuthorized = await this._getTips.canExecute(req.user, {
      uid: userId,
    });
    if (!isAuthorized) {
      return res.sendStatus(401);
    }
    const result = await this._getTips.execute({
      uid: userId,
    });
    return res.status(httpStatus.OK).send(result.props);
  }
}
