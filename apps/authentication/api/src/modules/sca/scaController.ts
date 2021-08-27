import { VerifierMapper, RestrictedVerifierMapper } from '@oney/authentication-adapters';
import {
  AuthIdentifier,
  ConsumeVerifier,
  IdentityEncodingService,
  RequestSca,
  RequestVerifier,
  VerifyCredentials,
} from '@oney/authentication-core';
import { DomainError } from '@oney/common-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { inject, injectable } from 'inversify';
import { JsonController, Post, Res, Req, Get, Body, UseBefore } from 'routing-controllers';
import { ScaErrorHandler } from './ScaErrorHandler';
import { CredentialsCommand } from './commands/credentials.command';
import { RequestAuthCommand } from './commands/requestAuthCommand';
import { ScaAuthorizationTokenMiddleware } from '../../config/middlewares/ScaAuthorizationTokenMiddleware';
import { UserAuthorizationTokenMiddleware } from '../../config/middlewares/UserAuthorizationTokenMiddleware';
import { UserRequest } from '../configuration/reqContext/User';
import { ScaRequestPayload } from '../configuration/reqContext/Verifier';

@JsonController('/sca')
@UseBefore(UserAuthorizationTokenMiddleware)
@injectable()
export class ScaController {
  scaTokenMapper: VerifierMapper;
  restrictedVerifierMapper: RestrictedVerifierMapper;

  constructor(
    private readonly _requestSca: RequestSca,
    @inject(AuthIdentifier.identityEncodingService)
    private readonly _identityEncoder: IdentityEncodingService,
    private readonly _requestVerifier: RequestVerifier,
    private readonly _verifyCredentials: VerifyCredentials,
    private readonly _consumeVerifier: ConsumeVerifier,
  ) {
    this.scaTokenMapper = new VerifierMapper();
    this.restrictedVerifierMapper = new RestrictedVerifierMapper();
  }

  @Post('/verifier')
  async requestAuth(
    @Req() req: UserRequest,
    @Res() res: Response,
    @Body() cmd: RequestAuthCommand,
  ): Promise<Response> {
    try {
      const verifier = await this._requestSca.execute({
        userId: req.user.uid,
        action: cmd.action,
        byPassPinCode: cmd.shouldByPassPinCode,
      });
      const encodeVerifier = this._identityEncoder.scaToken.encode(this.scaTokenMapper.fromDomain(verifier));
      res.setHeader('sca_token', encodeVerifier);
      // Mapper status PENDING ou EXPIRED et '' | ''
      const restrictedVerifier = this.restrictedVerifierMapper.fromDomain(verifier);
      return res.status(httpStatus.FORBIDDEN).send(restrictedVerifier);
    } catch (error) {
      return ScaErrorHandler.requestAuthError(error, res);
    }
  }

  @UseBefore(ScaAuthorizationTokenMiddleware)
  @Get('/verifier')
  async requestVerifier(@Res() res: Response, @Req() req: ScaRequestPayload): Promise<Response> {
    const verifier = await this._requestVerifier.execute({
      verifierId: req.verifier.verifierId,
    });
    const restrictedVerifier = this.restrictedVerifierMapper.fromDomain(verifier);
    return res.status(httpStatus.OK).send(restrictedVerifier);
  }

  @UseBefore(ScaAuthorizationTokenMiddleware)
  @Post('/verify')
  async verifyCredential(
    @Res() res: Response,
    @Req() req: ScaRequestPayload,
    @Body() credentials: CredentialsCommand,
  ): Promise<Response> {
    try {
      const verifier = await this._verifyCredentials.execute({
        verifierId: req.verifier.verifierId,
        credential: credentials.credentials,
      });
      const restrictedVerifier = this.restrictedVerifierMapper.fromDomain(verifier);
      return res.status(httpStatus.OK).send(restrictedVerifier);
    } catch (e) {
      const { safeMessage, cause } = e as DomainError;
      const { uid = req.verifier.customer.uid, msg = e.message, code } = cause || {};
      const resStatus: number = +code || httpStatus.BAD_REQUEST;
      return res.status(resStatus).json({
        code: resStatus,
        type: safeMessage,
        message: msg,
        uid: uid,
      });
    }
  }

  @UseBefore(ScaAuthorizationTokenMiddleware)
  @Post('/consume')
  async consumeVerifier(@Res() res: Response, @Req() req: ScaRequestPayload): Promise<Response> {
    const verifier = await this._consumeVerifier.execute({
      verifierId: req.verifier.verifierId,
    });
    const restrictedVerifier = this.restrictedVerifierMapper.fromDomain(verifier);
    return res.status(httpStatus.OK).send(restrictedVerifier);
  }
}
