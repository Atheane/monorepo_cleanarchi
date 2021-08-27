import { AuthIdentifier, IdentityEncoder, IdentityEncodingService } from '@oney/authentication-core';
import { injectable, multiInject } from 'inversify';

@injectable()
export class JwtTokenHandlers implements IdentityEncodingService {
  public scaToken: IdentityEncoder;

  public authToken: IdentityEncoder;

  constructor(@multiInject(AuthIdentifier.identityEncoder) identityEncoders: IdentityEncoder[]) {
    [this.authToken, this.scaToken] = identityEncoders;
  }
}
