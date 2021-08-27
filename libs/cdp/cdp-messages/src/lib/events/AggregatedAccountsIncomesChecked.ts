import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { CdpEventName } from './CdpEventName';

export interface AccountIncomeVerification {
  accountAggregatedId: number;
  valid: boolean;
}

export interface AggregatedAccountsIncomesCheckedProps {
  verifications: Array<AccountIncomeVerification>;
  uid: string;
}

@DecoratedEvent({
  version: 1,
  name: CdpEventName.AGGREGATED_ACCOUNTS_INCOMES_CHECKED,
  namespace: '@oney/cdp',
})
export class AggregatedAccountsIncomesChecked implements DomainEvent<AggregatedAccountsIncomesCheckedProps> {
  id: string = uuidv4();
  props: AggregatedAccountsIncomesCheckedProps;

  constructor(props: AggregatedAccountsIncomesCheckedProps) {
    this.props = { ...props };
  }
}
