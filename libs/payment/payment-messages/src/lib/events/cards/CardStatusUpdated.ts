import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { CardStatus } from './types/CardStatus';
import { CardType } from './types/CardType';

export interface CardStatusUpdatedProps {
  id: string;
  type: CardType;
  status: CardStatus;
  userId: string;
  ref: string;
}

@DecoratedEvent({ version: 1, name: 'CARD_STATUS_UPDATED', namespace: '@oney/payment' })
export class CardStatusUpdated implements DomainEvent<CardStatusUpdatedProps> {
  id = uuidV4();

  props: CardStatusUpdatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: CardStatusUpdatedProps) {
    this.props = { ...props };
  }
}
