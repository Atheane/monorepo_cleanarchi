import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

export interface BillPaymentOrderedProps {
  offerId: string;
  uid: string;
  amount: number;
  orderId: string;
}

@DecoratedEvent({ version: 1, name: 'BILL_PAYMENT_ORDERED', namespace: '@oney/subscription' })
export class BillPaymentOrdered implements DomainEvent<BillPaymentOrderedProps> {
  id = uuidv4();
  props: BillPaymentOrderedProps;
  metadata: DomainEventMetadata;
  createdAt = new Date();

  constructor(props: BillPaymentOrderedProps) {
    this.props = props;
  }
}
