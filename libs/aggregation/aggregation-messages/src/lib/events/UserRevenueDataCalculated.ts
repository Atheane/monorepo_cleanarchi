import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { AggregationEvents } from './AggregationEvents';
import { BankAccountType, CreditScoring, CreditInsights } from './types';

export interface UserRevenueDataCalculatedProps {
  aggregatedBankAccounts: { id: string; type: BankAccountType }[];
  creditScoring: CreditScoring;
  creditInsights: CreditInsights;
}

@DecoratedEvent({
  name: AggregationEvents.USER_REVENUE_DATA_CALCULATED,
  version: 1,
  namespace: '@oney/aggregation',
})
export class UserRevenueDataCalculated implements DomainEvent<UserRevenueDataCalculatedProps> {
  readonly id = uuidv4();
  readonly props: UserRevenueDataCalculatedProps;
  readonly metadata: DomainEventMetadata;

  constructor(props: UserRevenueDataCalculatedProps) {
    this.props = { ...props };
  }
}
