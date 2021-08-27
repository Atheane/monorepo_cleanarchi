import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidV4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

export interface AccountCeilingConsumptionUpdatedProps {
  consumed: number;
}

@DecoratedEvent({ version: 1, name: 'ACCOUNT_CEILING_CONSUMPTION_UPDATED', namespace: '@oney/payment' })
export class AccountCeilingConsumptionUpdated implements DomainEvent<AccountCeilingConsumptionUpdatedProps> {
  id = uuidV4();
  props: AccountCeilingConsumptionUpdatedProps;
  metadata?: DomainEventMetadata;

  constructor(props: AccountCeilingConsumptionUpdatedProps, metadata?: DomainEventMetadata) {
    this.props = { ...props };
    this.metadata = { ...metadata };
  }
}
