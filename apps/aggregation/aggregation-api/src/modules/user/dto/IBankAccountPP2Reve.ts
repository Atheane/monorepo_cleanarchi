import { TransactionProperties, BankAccountUsage, BankAccountType } from '@oney/aggregation-core';

export interface IBankAccountPP2Reve {
  iban?: string;
  fullName?: string;
  transactions: TransactionProperties[];
  connectionRefId: string;
  connectionDate: Date;
  usage: BankAccountUsage;
  type: BankAccountType;
  ownership: string;
}
