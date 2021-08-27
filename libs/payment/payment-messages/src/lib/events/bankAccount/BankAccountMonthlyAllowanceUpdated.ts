import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';

export interface BankAccountMonthlyAllowanceUpdatedProps {
  monthlyAllowance: {
    remainingFundToSpend: number;
    authorizedAllowance: number;
  };
}

@DecoratedEvent({ version: 1, name: 'BANK_ACCOUNT_MONTHLY_ALLOWANCE_UPDATED', namespace: '@oney/payment' })
export class BankAccountMonthlyAllowanceUpdated
  implements DomainEvent<BankAccountMonthlyAllowanceUpdatedProps> {
  id = uuidV4();

  props: BankAccountMonthlyAllowanceUpdatedProps;

  metadata?: DomainEventMetadata;

  constructor(props: BankAccountMonthlyAllowanceUpdatedProps) {
    this.props = { ...props };
  }
}
