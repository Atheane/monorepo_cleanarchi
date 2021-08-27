import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';

export interface BankAccountCreatedProps {
  uid: string;
  firstName: string;
  lastName: string; // lastName = legalName || birthName
  birthCountry: string;
  email: string;
  birthDate: Date;
  address: {
    street: string;
    additionalStreet?: string;
    city: string;
    zipCode: string;
    country: string;
  };
  phone: string;
}

@DecoratedEvent({ version: 1, name: 'BANK_ACCOUNT_CREATED', namespace: '@oney/payment' })
export class BankAccountCreated implements DomainEvent<BankAccountCreatedProps> {
  id = uuidV4();

  props: BankAccountCreatedProps;

  constructor(props: BankAccountCreatedProps) {
    this.props = { ...props };
  }
}
