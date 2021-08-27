import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { ProfileStatus } from '../types/ProfileStatus';

export enum ProfileActivationType {
  AGGREGATION = 'aggregation',
  TRANSFER = 'transfer',
}

export interface ProfileActivatedProps {
  profileStatus: ProfileStatus;
  activationType: ProfileActivationType;
}

@DecoratedEvent({ version: 1, name: 'PROFILE_ACTIVATED', namespace: '@oney/profile' })
export class ProfileActivated implements DomainEvent<ProfileActivatedProps> {
  id: string = uuidv4();

  props: ProfileActivatedProps;

  metadata?: DomainEventMetadata;

  constructor(props: ProfileActivatedProps, metadata?: DomainEventMetadata) {
    this.props = props;
    this.metadata = metadata;
  }
}
