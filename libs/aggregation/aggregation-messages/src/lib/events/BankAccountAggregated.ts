import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { AggregationEvents } from './AggregationEvents';

export interface BankAccountAggregatedProps {
  userId: string;
  isOwnerBankAccount: boolean;
}

@DecoratedEvent({
  name: AggregationEvents.BANK_ACCOUNT_AGGREGATED,
  version: 2,
  namespace: '@oney/aggregation',
})
export class BankAccountAggregated implements DomainEvent<BankAccountAggregatedProps> {
  readonly id = uuidv4();
  readonly props: BankAccountAggregatedProps;
  readonly metadata?: DomainEventMetadata;

  constructor(props: BankAccountAggregatedProps) {
    this.props = { ...props };
  }
}
