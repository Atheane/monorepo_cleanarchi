import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { CardStatus } from './types/CardStatus';
import { CardType } from './types/CardType';

export interface CardCreatedProps {
  id: string;

  ownerId: string;

  ref: string;

  type: CardType;

  status: CardStatus;

  pan: string;
}

@DecoratedEvent({ version: 1, name: 'CARD_CREATED', namespace: '@oney/payment' })
export class CardCreated implements DomainEvent<CardCreatedProps> {
  id = uuidV4();

  props: CardCreatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: CardCreatedProps) {
    this.props = { ...props };
  }
}
