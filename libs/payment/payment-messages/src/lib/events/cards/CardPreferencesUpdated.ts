import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { CardPreferences } from './types/CardPreferences';

export interface CardPreferencesUpdatedProps {
  id: string;

  hasPin: boolean;

  preferences: CardPreferences;
}

@DecoratedEvent({ version: 1, name: 'CARD_UPDATED', namespace: '@oney/payment' })
export class CardPreferencesUpdated implements DomainEvent<CardPreferencesUpdatedProps> {
  id = uuidV4();

  props: CardPreferencesUpdatedProps;
  metadata?: DomainEventMetadata;

  constructor(props: CardPreferencesUpdatedProps) {
    this.props = { ...props };
  }
}
