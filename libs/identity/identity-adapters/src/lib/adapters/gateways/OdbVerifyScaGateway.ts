import { IHttpBuilder } from '@oney/http';
import {
  IdentityEncoder,
  IdentityIdentifier,
  ScaErrors,
  ScaVerifier,
  VerifyScaGateway,
  VerifyScaPayload,
  AuthStatus,
} from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import ScaRequestError = ScaErrors.ScaRequestError;

@injectable()
export class OdbVerifyScaGateway implements VerifyScaGateway {
  constructor(
    @inject(IdentityIdentifier.identityEncoder) private readonly _odbIdentityEncoder: IdentityEncoder,
    private readonly _http: IHttpBuilder,
  ) {}

  async verify(verifyScaPayload: VerifyScaPayload): Promise<ScaVerifier> {
    try {
      const encodeUserToken = await this._odbIdentityEncoder.encode(verifyScaPayload.identity);
      if (!verifyScaPayload.identity.scaHolder) {
        throw new ScaErrors.ScaVerifierNotValid('SCA_TOKEN_REQUIRED');
      }
      const result = await this._http
        .get<ScaVerifier>(`/sca/verifier`, null, {
          sca_token: verifyScaPayload.identity.scaHolder,
          Authorization: `Bearer ${encodeUserToken}`,
        })
        .execute();
      const encodedAction = Buffer.from(verifyScaPayload.request.payload).toString('base64');
      if (
        result.data.action.type !== verifyScaPayload.request.type ||
        encodedAction !== result.data.action.payload ||
        result.data.status !== AuthStatus.DONE
      ) {
        throw new ScaErrors.ScaVerifierNotValid('SCA_ACTION_NOT_VALID');
      }
      if (result.data.consumedAt) {
        throw new ScaErrors.ScaVerifierActionAlreadyConsumed('ACTION_ALREADY_CONSUMED');
      }
      return result.data;
    } catch (e) {
      if (
        e instanceof ScaErrors.ScaVerifierNotValid ||
        e instanceof ScaErrors.ScaVerifierActionAlreadyConsumed ||
        e.response.status === 403
      ) {
        throw new ScaErrors.ScaRequired('SCA_IS_REQUIRED', {
          action: {
            type: verifyScaPayload.request.type,
            payload: verifyScaPayload.request.payload,
          },
        });
      }
      throw new ScaRequestError('SCA_REQUEST_ERROR');
    }
  }
}
