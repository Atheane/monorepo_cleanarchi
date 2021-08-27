import { Invitation } from '../entities/Invitation';
import { Channel } from '../types/Channel';

export interface InvitationGateway {
  send(invitation: Invitation, channel: Channel): Promise<void>;
}
