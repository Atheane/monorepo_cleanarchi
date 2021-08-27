import { Id } from './Id';

export type Transaction = Id & TransactionProperties;

export type TransactionProperties = {
  amount: number;
  category: string;
  date: Date;
  description: string;
  type: TransactionType;
  reference?: string;
  currency?: string;
  banksUserCardId?: string;
  userDescription?: string;
  simplifiedDescription?: string;
  algoanCategory?: string; //a string type instead of an enum type, because the API is not mature
  organizationId?: string;
  chatflowId?: string;
  accountId?: string;
  inserted?: boolean;
  validity?: any;
  algoanType?: string;
  comments?: any[];
  referenceAccound?: string;
};

export enum TransactionType {
  ATM = 'ATM',
  BANK_FEE = 'BANK_FEE',
  CASH = 'CASH',
  CHECK = 'CHECK',
  CREDIT = 'CREDIT',
  CREDIT_CARD_PAYMENT = 'CREDIT_CARD_PAYMENT',
  DEBIT = 'DEBIT',
  DEPOSIT = 'DEPOSIT',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  DIRECT_DEPOSIT = 'DIRECT_DEPOSIT',
  DIVIDEND = 'DIVIDEND',
  ELECTRONIC_PAYMENT = 'ELECTRONIC_PAYMENT',
  INTEREST = 'INTEREST',
  INTERNAL_TRANSFERT = 'INTERNAL_TRANSFERT',
  POINT_OF_SALE = 'POINT_OF_SALE',
  POTENTIAL_TRANSFER = 'POTENTIAL_TRANSFER',
  REPEATING_PAYMENT = 'REPEATING_PAYMENT',
  OTHER = 'OTHER',
  UNKNOWN = 'UNKNOWN',
}
