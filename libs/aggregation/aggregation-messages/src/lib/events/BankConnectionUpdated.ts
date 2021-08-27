import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { ConnectionStateEnum } from './types';
import { AggregationEvents } from './AggregationEvents';

export interface BankConnectionUpdatedProps {
  state: ConnectionStateEnum;
  userId: string;
  refId: string;
}

@DecoratedEvent({
  name: AggregationEvents.BANK_CONNECTION_UPDATED,
  version: 1,
  namespace: '@oney/aggregation',
})
export class BankConnectionUpdated implements DomainEvent<BankConnectionUpdatedProps> {
  readonly id = uuidv4();
  readonly props: BankConnectionUpdatedProps;
  readonly metadata?: DomainEventMetadata;
  constructor(props: BankConnectionUpdatedProps) {
    this.props = { ...props };
  }
}
