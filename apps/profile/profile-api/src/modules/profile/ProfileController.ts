import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import {
  GetUserInfos,
  VerifyBankAccountOwner,
  BankAccountOwnerCommand,
  CreateProfile,
  UploadTaxNotice,
  UploadTaxNoticeCommand,
  UpdateConsents,
} from '@oney/profile-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import {
  Get,
  JsonController,
  Param,
  Req,
  Res,
  UseBefore,
  Post,
  Body,
  UploadedFile,
  Put,
} from 'routing-controllers';
import { VerifyBankAccountOwnerCommand } from './commands/VerifyBankAccountOwnerCommand';
import { CreateProfileCommand } from './commands/CreateProfileCommand';
import { UpdateConsentsCommand } from './commands/UpdateConsentsCommand';
import { AuthentifiedRequest } from '../../config/middlewares/types/AuthentifiedRequest';
import { ProfileMapper } from '../mappers/ProfileMapper';

@JsonController('/user')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class ProfileController {
  constructor(
    private readonly _getUserInfos: GetUserInfos,
    private readonly _getProfileMapper: ProfileMapper,
    private readonly _createProfile: CreateProfile,
    private readonly _verifyBankAccountOwner: VerifyBankAccountOwner,
    private readonly _uploadTaxNotice: UploadTaxNotice,
    private readonly _profileMapper: ProfileMapper,
    private readonly _updateConsents: UpdateConsents,
  ) {}

  @Get('/:uid')
  async getUser(@Param('uid') userId: string, @Res() res: Response, @Req() req: AuthentifiedRequest) {
    const isAuthorized = await this._getUserInfos.canExecute(req.user, {
      uid: userId,
    });
    if (!isAuthorized) {
      return res.sendStatus(401);
    }
    const result = await this._getUserInfos.execute({
      uid: userId,
    });
    const user = this._getProfileMapper.fromDomain(result);
    return res.status(httpStatus.OK).send(user);
  }

  @Put('/:uid/consents')
  async updateConsents(
    @Param('uid') userId: string,
    @Body() cmd: UpdateConsentsCommand,
    @Res() res: Response,
    @Req() req: AuthentifiedRequest,
  ) {
    const body = UpdateConsentsCommand.setProperties(cmd);
    const request = {
      uid: userId,
      consents: {
        oney: {
          cnil: body.oney_cnil,
          len: body.oney_len,
        },
        partners: {
          cnil: body.partners_cnil,
          len: body.partners_len,
        },
      },
    };

    const isAuthorized = await this._updateConsents.canExecute(req.user, request);
    if (!isAuthorized) {
      return res.sendStatus(401);
    }
    const result = await this._updateConsents.execute(request);
    const user = this._getProfileMapper.fromDomain(result);
    return res.status(httpStatus.OK).send(user);
  }

  @Post('/')
  async createProfile(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Body() cmd: CreateProfileCommand,
  ) {
    const isAuthorized = await this._createProfile.canExecute(req.user);
    if (!isAuthorized) {
      return res.sendStatus(401);
    }
    const body = CreateProfileCommand.setProperties(cmd);
    await this._createProfile.execute({
      email: body.email,
      uid: body.uid,
      phone: body.phone,
    });
    return res.sendStatus(httpStatus.CREATED);
  }

  @Post('/:uid/verify-bankaccount-owner')
  async VerifyBankAccount(
    @Param('uid') userId: string,
    @Body() cmd: VerifyBankAccountOwnerCommand,
    @Res() res: Response,
    @Req() req: AuthentifiedRequest,
  ) {
    const isAuthorized = await this._verifyBankAccountOwner.canExecute(req.user);
    if (!isAuthorized) {
      return res.sendStatus(401);
    }
    const body = VerifyBankAccountOwnerCommand.setProperties(cmd);
    const verifyBankAccountOwnerCommand: BankAccountOwnerCommand = {
      ...body,
      uid: userId,
    };
    const result = await this._verifyBankAccountOwner.execute(verifyBankAccountOwnerCommand);
    return res.status(httpStatus.OK).send({ isOwnerBankAccount: result });
  }

  @Post('/:uid/tax-notice')
  async setTaxNotice(
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
    @UploadedFile('document') file: any,
  ) {
    const isAuthorized = await this._uploadTaxNotice.canExecute(req.user, { uid });
    if (!isAuthorized) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (!file) return res.sendStatus(httpStatus.BAD_REQUEST);
    const cmd: UploadTaxNoticeCommand = { uid, file };

    const profile = await this._uploadTaxNotice.execute(cmd);

    return res.status(httpStatus.OK).send(this._profileMapper.fromDomain(profile));
  }
}
