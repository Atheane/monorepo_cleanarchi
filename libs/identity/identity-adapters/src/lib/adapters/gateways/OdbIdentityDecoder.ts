import { AuthErrors, Identity, IdentityDecoder, IdentityIdentifier } from '@oney/identity-core';
import { inject, injectable, unmanaged } from 'inversify';
import { Secret, TokenExpiredError, verify, VerifyOptions } from 'jsonwebtoken';
import { OdbIdentityMapper } from '../mappers/OdbIdentityMapper';

@injectable()
export class OdbIdentityDecoder implements IdentityDecoder {
  constructor(
    @inject(IdentityIdentifier.odbIdentityMapper) private readonly odbIdentityMapper: OdbIdentityMapper,
    @unmanaged() private readonly secret: Secret,
    @unmanaged() private readonly verifyOptions: VerifyOptions,
  ) {}

  async decode(holder: string): Promise<Identity> {
    try {
      const decoded = this._verifyToken(holder);
      return this.odbIdentityMapper.toDomain(decoded);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new AuthErrors.MalformedHolderIdentity('TOKEN_EXPIRED', e);
      }
      throw new AuthErrors.MalformedHolderIdentity('MALFORMED_IDENTITY_PROVIDED', e);
    }
  }

  private _verifyToken(holder: string) {
    return verify(holder, this.secret, this.verifyOptions);
  }
}
