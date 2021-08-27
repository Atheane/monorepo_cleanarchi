import { PublicProperties } from '@oney/common-core';
import { BankAccount } from '../aggregates/BankAccount';
import { BankConnection } from '../aggregates/BankConnection';
import { BankField } from '../valueobjects/BankField';

export class Bank {
  uid: string;

  logo?: string;

  name: string;

  form: BankField[];

  code: string;

  featured: boolean;

  connection?: BankConnection;

  accounts?: BankAccount[];

  constructor(bank: PublicProperties<Bank>) {
    Object.assign(this, bank);
  }
}
