import { Currency } from '@oney/common-core';
import { Bank, Checking } from '../types';
import { Amount } from '../valueobjects/Amount';

export class BankAccount<T = Checking> {
  id: string;

  name: string;

  number?: string;

  currency: Currency;

  balance: Amount;

  metadatas: T;

  bank: Bank;

  constructor({
    balance,
    ...props
  }: {
    balance: number;
    id: string;
    name: string;
    number?: string;
    currency: Currency;
    metadatas: T;
    bank: Bank;
  }) {
    Object.assign(this, props);
    this.balance = new Amount(balance);
  }
}
