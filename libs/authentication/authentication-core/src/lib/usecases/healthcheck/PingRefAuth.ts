import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import {
  AuthRequestGenerator,
  UserUid,
  GeneratedEchoRequest,
} from '../../domain/gateways/AuthRequestGenerator';
import { AuthRequestHandler } from '../../domain/handlers/AuthRequestHandler';
import { PingIcgError } from '../../domain/models/AuthenticationError';
import { AuthIdentifier } from '../AuthIdentifier';

export enum RefAuthResponseReturnTypeCodes {
  OK = '0',
  ALERT = '1',
  TECHNICAL_ERROR = '2',
  REQUEST_ERROR = '3',
  CONTRACT_EXECUTION_ERROR = '4',
}

@injectable()
export class PingRefAuth implements Usecase<null, boolean> {
  constructor(
    @inject(AuthIdentifier.echoRequestGenerator)
    private readonly _echoRequestGenerator: AuthRequestGenerator<UserUid, GeneratedEchoRequest>,
    @inject(AuthIdentifier.authRequestHandler) private readonly _authRequestHandler: AuthRequestHandler,
  ) {}

  async execute(): Promise<boolean> {
    const authRequest = await this._echoRequestGenerator.generate({ uid: 'health_check_id' });
    const { authResponse, status: authResponseStatus } = await this._authRequestHandler.handleRequest(
      authRequest as any,
    );
    const refAuthResponseTypeCode =
      authResponse['soap:Envelope']['soap:Body'][0]['ns2:echoResponse'][0]['RepnEcho'][0]['BlocRetr'][0][
        'CdTypeRetr'
      ][0];

    if (refAuthResponseTypeCode === RefAuthResponseReturnTypeCodes.OK) {
      return true;
    }

    throw new PingIcgError.IcgPingFailed('ICG_REFAUTH_PING_HAS_FAILED', {
      message: `ICG refauth return type is ${refAuthResponseTypeCode}`,
      name: 'ICG_REFAUTH_ECHO_ERROR',
      authResponse,
      authResponseStatus,
    });
  }
}
