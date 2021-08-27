import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 } from 'uuid';

export interface UserBlockedProps {
  blockedAt: Date;
}

@DecoratedEvent({ name: 'USER_BLOCKED', namespace: '@oney/authentication', version: 1 })
export class UserBlocked implements DomainEvent<UserBlockedProps> {
  id = v4();
  props: UserBlockedProps;
  metadata: DomainEventMetadata;

  constructor(props: UserBlockedProps) {
    this.props = props;
  }
}
