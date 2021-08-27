import { IHttpBuilder } from '@oney/http';
import { ConsumeScaGateway, Identity, IdentityEncoder, IdentityIdentifier } from '@oney/identity-core';
import { inject, injectable } from 'inversify';

@injectable()
export class OdbConsumeScaGateway implements ConsumeScaGateway {
  constructor(
    @inject(IdentityIdentifier.identityEncoder) private readonly _odbIdentityEncoder: IdentityEncoder,
    private readonly _http: IHttpBuilder,
  ) {}

  async consume(identity: Identity): Promise<void> {
    const encodeUserToken = await this._odbIdentityEncoder.encode(identity);
    await this._http
      .post(`/sca/consume`, null, null, {
        sca_token: identity.scaHolder,
        Authorization: `Bearer ${encodeUserToken}`,
      })
      .execute();
  }
}
