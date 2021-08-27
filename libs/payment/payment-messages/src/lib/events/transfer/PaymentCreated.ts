import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { CounterParty } from './types/CounterParty';
import { Recurrency } from './types/Recurrency';
import { Tag } from './types/Tag';

export interface PaymentCreatedProps {
  id: string;
  beneficiary: CounterParty;
  sender: CounterParty;
  amount: number;
  message: string;
  orderId: string;
  executionDate: Date;
  tag: Tag;
  recurrence?: Recurrency;
}

@DecoratedEvent({ version: 1, name: 'PAYMENT_CREATED', namespace: '@oney/payment' })
export class PaymentCreated implements DomainEvent<PaymentCreatedProps> {
  id = uuidV4();

  props: PaymentCreatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: PaymentCreatedProps) {
    this.props = { ...props };
  }
}
