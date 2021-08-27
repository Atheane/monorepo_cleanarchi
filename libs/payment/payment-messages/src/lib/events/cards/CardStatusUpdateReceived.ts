import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 } from 'uuid';
import { EventActionCodesKey } from '../../types/EventActionCodes';
import { EventCallbackTypesKey } from '../../types/EventCallbackTypes';
import { EventCardStatusesKey } from '../../types/EventCardStatuses';
import { EventCardTypesKey } from '../../types/EventCardTypes';
import { EventOpposedReasonKey } from '../../types/EventOpposedReason';

export class CardStatusUpdateReceivedProps {
  id: string;
  date: Date;
  reference: string;
  type: EventCallbackTypesKey;
  cardType: EventCardTypesKey;
  actionCode: EventActionCodesKey;
  status: EventCardStatusesKey;
  opposedReason: EventOpposedReasonKey;
  userId: string;

  constructor(cardStatus: CardStatusUpdateReceivedProps) {
    Object.assign(this, cardStatus);
  }
}

@DecoratedEvent({ name: 'CARD_STATUS_UPDATE_RECEIVED', version: 1, namespace: '@oney/payment' })
export class CardStatusUpdateReceived implements DomainEvent<CardStatusUpdateReceivedProps> {
  id: string;
  props: CardStatusUpdateReceivedProps;
  metadata?: DomainEventMetadata;

  constructor(cardStatus: CardStatusUpdateReceivedProps) {
    this.id = v4();
    this.props = {
      ...cardStatus,
    };
  }
}
