import { Currency } from '@oney/common-core';
import { Direction, TransactionStatus, TransactionType } from '../types';
import { AmountPositive } from '../valueobjects/AmountPositive';

export class Transaction {
  refId: string;

  bankAccountId: string;

  amount: AmountPositive;

  originalAmount?: AmountPositive;

  date: Date;

  clearingDate?: Date;

  conversionRate?: number;

  currency: Currency;

  direction: Direction;

  rejectionReason?: string;

  status: TransactionStatus;

  type: TransactionType;

  label: string;

  fees?: AmountPositive;

  isDeposit?: boolean;

  tag?: string;

  constructor({
    amount,
    originalAmount,
    fees,
    isDeposit,
    tag,
    ...props
  }: {
    refId: string;
    bankAccountId: string;
    amount: number;
    originalAmount?: number;
    date: Date;
    clearingDate?: Date;
    conversionRate?: number;
    currency: Currency;
    direction: Direction;
    rejectionReason?: string;
    status: TransactionStatus;
    type: TransactionType;
    label: string;
    fees?: number;
    isDeposit?: boolean;
    tag?: string;
  }) {
    Object.assign(this, props);
    this.amount = new AmountPositive(amount);
    this.originalAmount = originalAmount === null ? null : new AmountPositive(originalAmount);
    this.fees = fees === null ? null : new AmountPositive(fees);
    this.isDeposit = isDeposit || false;
    if (tag) {
      this.tag = tag;
    }
  }
}
