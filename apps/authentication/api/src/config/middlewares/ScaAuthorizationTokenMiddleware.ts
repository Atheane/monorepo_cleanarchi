import {
  VerifierMapper,
  ImmuableVerifierProperties,
  RestrictedVerifierMapper,
} from '@oney/authentication-adapters';
import {
  AuthIdentifier,
  ConsumeVerifier,
  IdentityEncodingService,
  RequestSca,
  RequestVerifier,
  StrongAuthVerifier,
} from '@oney/authentication-core';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import { inject, injectable } from 'inversify';
import { Body, ExpressMiddlewareInterface, Req, Res } from 'routing-controllers';
import { IdentityProvider } from '@oney/identity-core';
import { UserRequest } from '../../modules/configuration/reqContext/User';
import { ScaRequestPayload } from '../../modules/configuration/reqContext/Verifier';
import { ScaErrorHandler } from '../../modules/sca/ScaErrorHandler';
import { RequestAuthCommand } from '../../modules/sca/commands/requestAuthCommand';

@injectable()
export class ScaAuthorizationTokenMiddleware implements ExpressMiddlewareInterface {
  scaTokenMapper: VerifierMapper;
  restrictedVerifierMapper: RestrictedVerifierMapper;

  constructor(
    @inject(AuthIdentifier.identityEncodingService)
    private readonly _identityEncoder: IdentityEncodingService,
    @inject(RequestVerifier) private readonly _requestVerifier: RequestVerifier,
    @inject(ConsumeVerifier) private readonly _consumeVerifier: ConsumeVerifier,
    @inject(RequestSca) private readonly _requestSca: RequestSca,
  ) {
    this.scaTokenMapper = new VerifierMapper();
    this.restrictedVerifierMapper = new RestrictedVerifierMapper();
  }

  private async _requestAuth(@Req() req: UserRequest, @Res() res: Response, @Body() cmd: RequestAuthCommand) {
    console.log('\n===_requestAuth====\n');

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

  async use(req: ScaRequestPayload & UserRequest, res: Response, next: Function): Promise<any> {
    const scaToken = req.headers.sca_token as string;
    const decodedToken = this._identityEncoder.scaToken.decode<ImmuableVerifierProperties>(scaToken);
    const { action } = req.body;
    if (!decodedToken) {
      return this._requestAuth(req, res, {
        action,
        shouldByPassPinCode: req.path.includes('pincode') && req.method === 'DELETE',
      });
    }

    const payload = this.scaTokenMapper.toDomain(decodedToken);
    const verifier = (await this._requestVerifier.execute({
      verifierId: payload.verifierId,
    })) as StrongAuthVerifier;

    req.verifier = verifier;

    if (verifier.isVerifierExpired()) {
      req.verifier = verifier;
      // Because here, we are bypassing the user authent middleware
      req.user = {
        uid: verifier.customer.uid,
        email: verifier.customer.email,
        roles: [],
        provider: IdentityProvider.odb,
        name: IdentityProvider.odb,
      };
      return this._requestAuth(req, res, { action });
    }
    if (
      (req.path === '/authentication/sca/verify' || req.path === '/authentication/sca/consume') &&
      req.method === 'POST'
    ) {
      return next();
    }

    // HERE because we dont want to check body request when requesting verifier.
    if (req.path !== '/authentication/sca/verifier' && req.method !== 'GET') {
      const currentPayload = JSON.parse(Buffer.from(action.payload, 'base64').toString('utf8'));
      const savedPayload = JSON.parse(Buffer.from(verifier.action.payload, 'base64').toString('utf8'));
      if (
        verifier.action.type !== action.type ||
        JSON.stringify(savedPayload.request.body) !== JSON.stringify(currentPayload.request.body)
      ) {
        return res.status(409).send(verifier);
      }

      if (verifier.consumedAt) {
        return res.status(403).send(verifier);
      }
      if (verifier.valid) {
        await this._consumeVerifier.execute({
          verifierId: payload.verifierId,
        });
      } else {
        return res.sendStatus(401);
      }
    }

    // Remove the action from body because we don't want any conflict with the current body request
    delete req.body.action;
    return next();
  }
}
