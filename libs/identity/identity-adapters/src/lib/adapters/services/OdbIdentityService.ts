import { IdentityDecoder, Identity, IdentityIdentifier, IdentityService } from '@oney/identity-core';
import { inject, injectable } from 'inversify';

@injectable()
export class OdbIdentityService implements IdentityService {
  constructor(
    @inject(IdentityIdentifier.identityDecoder) private readonly identityDecoder: IdentityDecoder,
  ) {}

  handle(holder: string): Promise<Identity> {
    return this.identityDecoder.decode(holder);
  }
}
