import { AuthIdentifier, IdentityEncodingService, Invitation } from '@oney/authentication-core';
import { Mapper } from '@oney/common-core';
import { inject, injectable } from 'inversify';

@injectable()
export class InvitationMapper implements Mapper<Invitation> {
  constructor(
    @inject(AuthIdentifier.identityEncodingService)
    private readonly identityEncodingService: IdentityEncodingService,
  ) {}

  // Case cover in Authentication-api
  /* istanbul ignore next */
  toDomain(raw: string): Invitation {
    const decoded = this.identityEncodingService.authToken.decode<Invitation>(raw);
    return {
      email: decoded.email,
      uid: decoded.uid,
      state: decoded.state,
      phone: decoded.phone,
      channel: decoded.channel,
    };
  }

  fromDomain(t: Invitation): string {
    const payload = {
      email: t.email,
      uid: t.uid,
      state: t.state,
      phone: t.phone,
      channel: t.channel,
    };
    return this.identityEncodingService.authToken.encode(payload);
  }
}
