import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { Events } from './Events';
import { RecipientRegisteredProperties } from '../types/RecipientRegisteredProperties';

@DecoratedEvent({ name: Events.RECIPIENT_REGISTERED, version: 1, namespace: '@oney/notification' })
export class RecipientRegistered implements DomainEvent<RecipientRegisteredProperties> {
  id = uuidv4();
  props: RecipientRegisteredProperties;
  metadata: DomainEventMetadata;

  constructor(preferences: RecipientRegisteredProperties) {
    this.props = { ...preferences };
  }
}
