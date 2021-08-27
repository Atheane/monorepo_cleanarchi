import { IdentityEncoder, Identity, IdentityIdentifier } from '@oney/identity-core';
import { inject, injectable, unmanaged } from 'inversify';
import { Secret, sign } from 'jsonwebtoken';
import { OdbIdentityMapper } from '../mappers/OdbIdentityMapper';

@injectable()
export class OdbIdentityEncoder implements IdentityEncoder {
  constructor(
    @inject(IdentityIdentifier.odbIdentityMapper) private readonly odbIdentityMapper: OdbIdentityMapper,
    @unmanaged() private readonly secret: Secret,
  ) {}

  async encode(payload: Identity): Promise<string> {
    const mappedIdentity = this.odbIdentityMapper.fromDomain(payload);
    return sign(mappedIdentity, this.secret);
  }
}
