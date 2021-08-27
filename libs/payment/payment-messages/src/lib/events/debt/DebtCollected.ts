import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { DebtCollectedProps } from './types/DebtCollected';
import { DebtEvents } from './types/DebtEvents';

@DecoratedEvent({ version: 1, name: DebtEvents.DEBT_COLLECTED, namespace: '@oney/payment' })
export class DebtCollected implements DomainEvent<DebtCollectedProps> {
  id = uuidV4();

  metadata?: DomainEventMetadata;
  constructor(public props: DebtCollectedProps) {
    this.props = { ...props };
  }
}
