import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { AuthenticationEvents } from './AuthenticationEvents';
import { Domain } from '../types/Domain';

export interface UserDeletedProps {
  uid: string;
}

@DecoratedEvent({ name: AuthenticationEvents.USER_DELETED, version: 1, namespace: Domain.AUTHENTICATION })
export class UserDeleted implements DomainEvent<UserDeletedProps> {
  readonly id = uuidv4();
  readonly props: UserDeletedProps;
  readonly metadata?: DomainEventMetadata;

  constructor(props: UserDeletedProps) {
    this.props = { ...props };
  }
}
