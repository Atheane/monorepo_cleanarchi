import { PublicProperties } from '@oney/common-core';
import * as moment from 'moment';
import { InvitationState } from '../types/InvitationState';
import { Channel } from '../..';

export class Invitation {
  uid: string;

  email: string;

  createdAt?: Date;

  updatedAt?: Date;

  channel: Channel;

  phone?: string;

  state?: InvitationState;

  constructor(invitation?: PublicProperties<Invitation>) {
    Object.assign(this, invitation);
  }

  isCompleted?(): boolean {
    return this.state === InvitationState.COMPLETED;
  }

  isInvitationExpired?(minutes: number): boolean {
    return moment(this.createdAt).isBefore(moment().subtract(minutes, 'minutes'));
  }
}
