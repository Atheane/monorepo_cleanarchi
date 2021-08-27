import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import {
  AddressStep,
  CivilStatus,
  FiscalStatusStep,
  GenerateOtpStep,
  SignContract,
  UploadIdentityDocument,
  UploadIdentityDocumentCommand,
  ValidateFacematch,
  ValidateFacematchRequest,
  ValidatePhoneStep,
} from '@oney/profile-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { injectable } from 'inversify';
import { Body, JsonController, Param, Post, Req, Res, UploadedFile, UseBefore } from 'routing-controllers';
import { AddressCommand } from './commands/AddressCommand';
import { CivilStatusCommand } from './commands/CivilStatusCommand';
import { FiscalStatusCommand } from './commands/FiscalStatusCommand';
import { ValidateFacematchCommand } from './commands/ValidateFacematchCommand';
import { ValidatePhoneCommand } from './commands/ValidatePhoneCommand';
import { SignContractCommand } from './commands/SignContractCommand';
import { IdentityDocumentCommand } from './commands/IdentityDocumentCommand';
import { GenerateOtpCommand } from './commands/GenerateOtpCommand';
import { ProfileMapper } from '../mappers/ProfileMapper';
import { AuthentifiedRequest } from '../../config/middlewares/types/AuthentifiedRequest';

@JsonController('/:uid/onboarding/step')
@UseBefore(ExpressAuthenticationMiddleware)
@injectable()
export class OnboardingController {
  constructor(
    private readonly _validateFacematch: ValidateFacematch,
    private readonly _civilStatus: CivilStatus,
    private readonly _fiscalStatus: FiscalStatusStep,
    private readonly _profileMapper: ProfileMapper,
    private readonly _address: AddressStep,
    private readonly _validatePhone: ValidatePhoneStep,
    private readonly _signContract: SignContract,
    private readonly _uploadIdentityDocument: UploadIdentityDocument,
    private readonly _generateOtpStep: GenerateOtpStep,
  ) {}

  @Post('/facematch')
  async setFacematch(
    @Param('uid') userId: string,
    @Res() res: Response,
    @Body() cmd: ValidateFacematchCommand,
    @Req() req: AuthentifiedRequest,
  ): Promise<Response> {
    const validateFacematchRequest: ValidateFacematchRequest = {
      uid: userId,
      customerRank: cmd.customerRank ? cmd.customerRank : 0,
      selfieConsent: cmd.selfieConsent,
      selfieConsentDate: new Date(),
      result: cmd.result,
      msg: cmd.msg ? cmd.msg : '',
    };
    const isAuthorized = await this._validateFacematch.canExecute(req.user, validateFacematchRequest);
    if (!isAuthorized) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    const updatedProfile = await this._validateFacematch.execute(validateFacematchRequest);
    return res.status(httpStatus.OK).send(updatedProfile.props);
  }

  @Post('/civilstatus')
  async setCivilStatus(
    @Body() cmd: CivilStatusCommand,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const body = CivilStatusCommand.setProperties(cmd);
    const result = await this._civilStatus.execute(
      {
        ...body,
        birthName: body.lastName,
      },
      req.user,
    );
    return res.status(httpStatus.OK).send(this._profileMapper.fromDomain(result));
  }

  @Post('/address')
  async setAddress(
    @Body() cmd: AddressCommand,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const body = AddressCommand.setProperties(cmd);

    const result = await this._address.execute(
      {
        ...body,
      },
      req.user,
    );

    return res.status(httpStatus.OK).send(this._profileMapper.fromDomain(result));
  }

  @Post('/fiscalStatus')
  async setFiscalStatus(
    @Body() cmd: FiscalStatusCommand,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
  ): Promise<Response> {
    const { fiscalReference, declarativeFiscalSituation } = FiscalStatusCommand.setProperties(cmd);
    const payload = {
      uid,
      fiscalReference,
      declarativeFiscalSituation,
    };

    if (!(await this._fiscalStatus.canExecute(req.user, payload))) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    const result = await this._fiscalStatus.execute(payload);
    return res.status(httpStatus.OK).send(this._profileMapper.fromDomain(result));
  }

  @Post('/phone/validate')
  async validatePhone(
    @Body() cmd: ValidatePhoneCommand,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
  ): Promise<Response> {
    const body = ValidatePhoneCommand.setProperties(cmd);

    if (!(await this._validatePhone.canExecute(req.user, { ...body, uid }))) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const result = await this._validatePhone.execute({
      ...body,
      uid,
    });
    return res.status(httpStatus.OK).send(this._profileMapper.fromDomain(result));
  }

  @Post('/contract')
  async signContract(
    @Body() cmd: SignContractCommand,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
  ): Promise<Response> {
    const { date } = SignContractCommand.setProperties(cmd);

    if (!this._signContract.canExecute(req.user, { uid, date })) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const result = await this._signContract.execute({ uid, date });
    return res.status(httpStatus.OK).send(this._profileMapper.fromDomain(result));
  }

  @Post('/identity-document')
  async setIdentityDocument(
    @Body() cmd: IdentityDocumentCommand,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
    @UploadedFile('document') file: any,
  ): Promise<Response> {
    const { documentSide, documentType, nationality } = IdentityDocumentCommand.setProperties(cmd);
    const isAuthorized = await this._uploadIdentityDocument.canExecute(req.user, { uid });
    if (!isAuthorized) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    const uploadIdentityDocumentCommand: UploadIdentityDocumentCommand = {
      uid,
      file,
      documentSide,
      documentType,
      nationality,
    };

    const profile = await this._uploadIdentityDocument.execute(uploadIdentityDocumentCommand);

    return res.status(httpStatus.OK).send(this._profileMapper.fromDomain(profile));
  }

  @Post('/phone/otp')
  async generateOTP(
    @Body() cmd: GenerateOtpCommand,
    @Req() req: AuthentifiedRequest,
    @Res() res: Response,
    @Param('uid') uid: string,
  ): Promise<Response> {
    const body = GenerateOtpCommand.setProperties(cmd);

    if (!(await this._generateOtpStep.canExecute(req.user, { ...body, uid }))) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    await this._generateOtpStep.execute({
      ...body,
      uid,
    });
    return res.status(httpStatus.NO_CONTENT).send();
  }
}
