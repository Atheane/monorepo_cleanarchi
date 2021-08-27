import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { CounterParty } from './types/CounterParty';
import { Recurrency } from './types/Recurrency';

export interface TransferCreatedProps {
  id: string;
  beneficiary: CounterParty;
  sender: CounterParty;
  amount: number;
  message: string;
  orderId: string;
  executionDate: Date;
  recurrence?: Recurrency;
  recipientEmail?: string;
}

@DecoratedEvent({ version: 1, name: 'TRANSFER_CREATED', namespace: '@oney/payment' })
export class TransferCreated implements DomainEvent<TransferCreatedProps> {
  id = uuidV4();

  props: TransferCreatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: TransferCreatedProps) {
    this.props = { ...props };
  }
}
