import {
  AuthIdentifier,
  BusDelivery,
  Channel,
  Invitation,
  InvitationGateway,
} from '@oney/authentication-core';
import { inject, injectable } from 'inversify';
import { InvitationMapper } from '../../mappers/jwt/InvitationMapper';
import { VerifierMapper } from '../../mappers/jwt/VerifierMapper';

@injectable()
export class SendInvitationGateway implements InvitationGateway {
  scaTokenMapper: VerifierMapper;

  constructor(
    @inject(AuthIdentifier.mappers.invitation) private readonly invitationMapper: InvitationMapper,
    @inject(AuthIdentifier.busDelivery) private readonly busService: BusDelivery,
  ) {
    this.scaTokenMapper = new VerifierMapper();
  }

  async send(invitation: Invitation, channel: Channel): Promise<void> {
    try {
      const token = this.invitationMapper.fromDomain(invitation);
      if (channel === Channel.EMAIL) {
        return await this.busService.send<{ email: string; token: string }>(
          'topic_odb-account_unvalidated-user-created',
          {
            email: invitation.email,
            token,
          },
        );
      }

      return await this.busService.send<{ phone: string; token: string }>(
        'topic_odb-account_unvalidated-user-created-sms',
        {
          phone: invitation.phone,
          token,
        },
      );
    } catch (e) {
      return;
    }
  }
}
