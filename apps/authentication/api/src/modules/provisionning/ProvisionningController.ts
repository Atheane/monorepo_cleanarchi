import { ProvisionUserPhone, ProvisionUserPassword, BlockUser } from '@oney/authentication-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { inject, injectable } from 'inversify';
import { Body, JsonController, Param, Post, Res, UseBefore } from 'routing-controllers';
import { ProvisionUserCard } from '@oney/authentication-core';
import { ProvisionUserPhoneCommand } from './commands/ProvisionUserPhoneCommand';
import { BasicAuthMiddleware } from './middlewares/BasicAuthMiddleware';
import { ProvisionUserCardCommand } from './commands/ProvisionUserCardCommand';
import { UsingBasicAuthUriPath } from './UsingBasicAuthUriPath';
import { ProvisionUserPasswordCommand } from './commands/ProvisionUserPasswordCommand';
import { envConfiguration } from '../../config/server/Envs';

export const useExtraFeature = Symbol.for('useExtraFeature');

@JsonController('')
@UseBefore(BasicAuthMiddleware)
@injectable()
export class ProvisionningController {
  constructor(
    private readonly _provisionUserPhone: ProvisionUserPhone,
    private readonly _provisionUserCard: ProvisionUserCard,
    private readonly _provisionUserPassword: ProvisionUserPassword,
    private readonly _blockUser: BlockUser,
    @inject(useExtraFeature) private readonly _useExtraFeature: boolean,
  ) {}

  @Post(UsingBasicAuthUriPath.PROVISION_PHONE)
  async provisionUserPhoneRequest(
    @Body() cmd: ProvisionUserPhoneCommand,
    @Param('uid') userId: string,
    @Res() res: Response,
  ) {
    try {
      await this._provisionUserPhone.execute({
        userId,
        phone: cmd.phone,
        useIcgSmsAuthFactor:
          cmd.useIcgSmsAuthFactor == null
            ? /* istanbul ignore next */
              envConfiguration.getLocalVariables().useIcgSmsAuthFactor
            : cmd.useIcgSmsAuthFactor,
      });
      return res.status(httpStatus.CREATED).send({
        status: 'DONE',
      });
    } catch (e) {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: 'ERROR',
        reason: e,
      });
    }
  }

  @Post(UsingBasicAuthUriPath.PROVISION_CARD)
  async provisionUserCardRequest(
    @Body() cmd: ProvisionUserCardCommand,
    @Param('uid') userId: string,
    @Res() res: Response,
  ) {
    try {
      await this._provisionUserCard.execute({
        userId,
        cardId: cmd.cardId,
        encryptedData: cmd.encryptedData,
      });
      return res.status(httpStatus.CREATED).send({
        status: 'DONE',
      });
    } catch (e) {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: 'ERROR',
        reason: e,
      });
    }
  }

  @Post(UsingBasicAuthUriPath.PROVISION_PASSWORD)
  async provisionUserPassword(
    @Param('uid') userId: string,
    @Body() cmd: ProvisionUserPasswordCommand,
    @Res() res: Response,
  ) {
    if (this._useExtraFeature) {
      await this._provisionUserPassword.execute({
        userId,
        password: cmd.password,
      });
      return res.sendStatus(httpStatus.CREATED);
    }
  }

  @Post(UsingBasicAuthUriPath.BAN_USER)
  async blockUser(@Param('uid') userId: string, @Res() res: Response) {
    if (this._useExtraFeature) {
      await this._blockUser.execute({
        uid: userId,
      });
      return res.sendStatus(httpStatus.OK);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
