import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { DebtEvents } from './types/DebtEvents';

export interface AllDebtsFullyCollectedProps {
  uid: string;
}

@DecoratedEvent({ version: 1, name: DebtEvents.ALL_DEBTS_FULLY_COLLECTED, namespace: '@oney/payment' })
export class AllDebtsFullyCollected implements DomainEvent<AllDebtsFullyCollectedProps> {
  id = uuidV4();

  metadata?: DomainEventMetadata;
  constructor(public props: AllDebtsFullyCollectedProps) {
    this.props = { ...props };
  }
}
