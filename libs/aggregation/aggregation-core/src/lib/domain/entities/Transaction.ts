import { Currency, TransactionType } from '@oney/common-core';
import { TransactionCategory } from '../types';

export interface TransactionProperties {
  id: string;
  bankAccountId: string;
  amount: number;
  date: Date;
  currency: Currency;
  type: TransactionType;
  label: string;
  // if transaction has been uploaded to credit decisioning partner (algoan)
  creditDecisioningTransactionId?: string;
  creditDecisioningAccountId?: string;
  category?: TransactionCategory;
}
export class Transaction {
  public props: TransactionProperties;

  constructor(props: TransactionProperties) {
    this.props = props;
  }
}
