import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { AggregationEvents } from './AggregationEvents';

export interface BankConnectionDeletedProps {
  userId: string;
  deletedAccountIds: string[];
  refId: string;
}

@DecoratedEvent({
  name: AggregationEvents.BANK_CONNECTION_DELETED,
  version: 1,
  namespace: '@oney/aggregation',
})
export class BankConnectionDeleted implements DomainEvent<BankConnectionDeletedProps> {
  readonly id = uuidv4();
  readonly props: BankConnectionDeletedProps;
  readonly metadata: DomainEventMetadata;

  constructor(props: BankConnectionDeletedProps) {
    this.props = { ...props };
  }
}
