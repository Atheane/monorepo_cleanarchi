import { Currency } from '@oney/common-core';
import { TransactionType } from './TransactionType';
import { CounterParty } from './CounterParty';

export type Operation = {
  transactionId: string;
  createdAt: Date;
  clearedAt: Date;
  type: TransactionType;
  description: string;
  direction: string;
  amount: number;
  originalAmount: number;
  currency: Currency;
  issuer?: CounterParty;
  beneficiary?: CounterParty;
  credit?: {
    initialTransactionId: string;
    key: string;
    contractNumber: string;
    productCode: string;
    monthPaid?: number;
    monthToPaid?: number;
    monthTotal: number;
  };
  counterParty?: {
    fullname: string;
    iban?: string;
  };
};
