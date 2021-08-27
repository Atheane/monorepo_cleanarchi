import { IHttpBuilder } from '@oney/http';
import {
  Identity,
  IdentityEncoder,
  IdentityIdentifier,
  RequestScaGateway,
  ScaErrors,
  ScaVerifier,
  Action,
} from '@oney/identity-core';
import { inject, injectable } from 'inversify';

@injectable()
export class OdbRequestScaGateway implements RequestScaGateway {
  constructor(
    @inject(IdentityIdentifier.identityEncoder) private readonly _odbIdentityEncoder: IdentityEncoder,
    private readonly _http: IHttpBuilder,
  ) {}

  async requestSca(identity: Identity, request: Action): Promise<ScaVerifier> {
    try {
      const encodeUserToken = await this._odbIdentityEncoder.encode(identity);
      await this._http
        .post<ScaVerifier>(
          '/sca/verifier',
          {
            action: {
              type: request.type,
              payload: Buffer.from(request.payload).toString('base64'),
            },
          },
          null,
          {
            Authorization: `Bearer ${encodeUserToken}`,
          },
        )
        .execute();
    } catch (e) {
      if (e.response.status === 403) {
        return { ...e.response.data, scaToken: e.response.headers['sca_token'] };
      }
      throw new ScaErrors.ScaDefaultVerifierError(e);
    }
  }
}
