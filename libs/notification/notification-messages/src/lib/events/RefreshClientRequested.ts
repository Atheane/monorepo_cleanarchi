import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { Events } from './Events';
import { RefreshClientRequestedProperties } from '../types/RefreshClientRequestedProperties';

@DecoratedEvent({ name: Events.REFRESH_CLIENT_REQUESTED, version: 1, namespace: '@oney/notification' })
export class RefreshClientRequested implements DomainEvent<RefreshClientRequestedProperties> {
  id = uuidv4();
  props: RefreshClientRequestedProperties;
  metadata: DomainEventMetadata;

  constructor(properties: RefreshClientRequestedProperties) {
    this.props = { ...properties };
  }
}
