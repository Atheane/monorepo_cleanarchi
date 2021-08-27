import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { DebtEvents } from './types/DebtEvents';

export interface DebtsCollectionOrderedProps {
  uid: string;
  amount: number;
}

@DecoratedEvent({ version: 1, name: DebtEvents.DEBTS_COLLECTION_ORDERED, namespace: '@oney/payment' })
export class DebtsCollectionOrdered implements DomainEvent<DebtsCollectionOrderedProps> {
  id = uuidV4();
  props: DebtsCollectionOrderedProps;

  metadata?: DomainEventMetadata;
  constructor(props: DebtsCollectionOrderedProps) {
    this.props = { ...props };
  }
}
