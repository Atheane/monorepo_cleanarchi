import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { Events } from './Events';
import { PreferencesUpdatedProperties } from '../types/PreferencesUpdatedProperties';

@DecoratedEvent({ name: Events.PREFERENCES_UPDATED, version: 1, namespace: '@oney/notification' })
export class PreferencesUpdated implements DomainEvent<PreferencesUpdatedProperties> {
  id = uuidv4();
  props: PreferencesUpdatedProperties;
  metadata: DomainEventMetadata;

  constructor(preferences: PreferencesUpdatedProperties) {
    this.props = { ...preferences };
  }
}
