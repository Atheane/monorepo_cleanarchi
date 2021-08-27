import { Invitation } from '@oney/authentication-core';
import { Request } from 'express';

export interface InvitationTokenPayload extends Request {
  invitation: Pick<Invitation, 'email' | 'uid' | 'state'>;
}
