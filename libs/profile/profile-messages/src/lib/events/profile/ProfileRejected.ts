import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

@DecoratedEvent({ version: 1, name: 'PROFILE_REJECTED', namespace: '@oney/profile' })
export class ProfileRejected implements DomainEvent<{}> {
  id: string = uuidv4();

  props: {};

  metadata?: DomainEventMetadata;
}
