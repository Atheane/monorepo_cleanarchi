import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ProfileStatus } from '../types/ProfileStatus';

export interface ProfileStatusChangedProps {
  status: ProfileStatus;
}

@DecoratedEvent({ version: 1, name: 'PROFILE_STATUS_CHANGED', namespace: '@oney/profile' })
export class ProfileStatusChanged implements DomainEvent<ProfileStatusChangedProps> {
  id: string = uuidv4();
  props: ProfileStatusChangedProps;
  metadata?: DomainEventMetadata;

  constructor(props: ProfileStatusChangedProps) {
    this.props = { ...props };
  }
}
