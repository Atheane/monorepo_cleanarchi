import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';

export interface BankAccountEligibilityGrantedProps {
  accountEligibility: boolean;
}

@DecoratedEvent({ version: 1, name: 'BANK_ACCOUNT_ELIGIBILITY_GRANTED', namespace: '@oney/payment' })
export class BankAccountEligibilityGranted implements DomainEvent<BankAccountEligibilityGrantedProps> {
  id = uuidV4();

  props: BankAccountEligibilityGrantedProps;

  constructor(props: BankAccountEligibilityGrantedProps) {
    this.props = { ...props };
  }
}
