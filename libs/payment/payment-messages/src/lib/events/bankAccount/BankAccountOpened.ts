import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';

export interface BankAccountOpenedProps {
  uid: string;
  bid: string;
  iban: string;
  bic: string;
}

@DecoratedEvent({ version: 1, name: 'BANK_ACCOUNT_OPENED', namespace: '@oney/payment' })
export class BankAccountOpened implements DomainEvent<BankAccountOpenedProps> {
  id = uuidV4();

  props: BankAccountOpenedProps;

  constructor(props: BankAccountOpenedProps) {
    this.props = { ...props };
  }
}
