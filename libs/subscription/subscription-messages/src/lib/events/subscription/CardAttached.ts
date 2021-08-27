import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

export interface CardAttachedProps {
  subscriberId: string;
  offerId: string;
  cardId: string;
}

@DecoratedEvent({ name: 'CARD_ATTACHED', version: 1, namespace: '@oney/subscription' })
export class CardAttached implements DomainEvent<CardAttachedProps> {
  id = uuidv4();
  props: CardAttachedProps;
  metadata: DomainEventMetadata;

  constructor(props: CardAttachedProps) {
    this.props = props;
  }
}
