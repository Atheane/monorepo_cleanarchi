import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';

export interface CheckAggregatedAccountsIncomesProps {
  uid: string;
}

@DecoratedEvent({ version: 1, name: 'CHECK_AGGREGATED_ACCOUNTS_INCOMES', namespace: '@oney/payment' })
export class CheckAggregatedAccountsIncomes implements DomainEvent<CheckAggregatedAccountsIncomesProps> {
  id: string = uuidV4();
  props: CheckAggregatedAccountsIncomesProps;

  constructor(props: CheckAggregatedAccountsIncomesProps) {
    this.props = { ...props };
  }
}
