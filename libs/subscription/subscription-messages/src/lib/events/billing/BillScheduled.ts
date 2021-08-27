import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { OfferRef } from '../../..';

export interface BillScheduledProps {
  uid: string;
  offerId: string;
  subscriptionId: string;
  billedAt: Date;
  orderId: string;
  index: number;
  amount: number;
  ref: OfferRef;
}

@DecoratedEvent({ version: 1, name: 'BILL_SCHEDULED', namespace: '@oney/subscription' })
export class BillScheduled implements DomainEvent<BillScheduledProps> {
  id = uuidv4();
  props: BillScheduledProps;
  metadata: DomainEventMetadata;

  constructor(props: BillScheduledProps) {
    this.props = props;
  }
}
