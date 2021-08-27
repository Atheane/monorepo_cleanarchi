import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { UncappingEventState } from '../../types/UncappingEventState';

export interface BankAccountUncappedProps {
  globalOut: {
    annualAllowance: number;
    monthlyAllowance: number;
    weeklyAllowance: number;
  };
  balanceLimit: number;
  uncappingState?: UncappingEventState;
}

@DecoratedEvent({ version: 1, name: 'BANK_ACCOUNT_UNCAPPED_FROM_AGGREGATION', namespace: '@oney/payment' })
export class BankAccountUncappedFromAggregation implements DomainEvent<BankAccountUncappedProps> {
  id = uuidV4();

  props: BankAccountUncappedProps;

  metadata?: DomainEventMetadata;

  constructor(props: BankAccountUncappedProps) {
    this.props = { ...props };
  }
}
