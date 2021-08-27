import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export interface CardSentProperties {
  cardId: string;

  userId: string;

  encryptedData: string;
}

@DecoratedEvent({ version: 1, name: 'CARD_SENT', namespace: '@oney/payment' })
export class CardSent implements DomainEvent<CardSentProperties> {
  id: string = uuidv4();

  props: CardSentProperties;
  metadata: DomainEventMetadata;
  constructor(props: CardSentProperties) {
    this.props = { ...props };
  }
}
