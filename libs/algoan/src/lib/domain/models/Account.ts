import { Id } from './Id';

export type Account = Id & AccountProperties;

export type AccountProperties = {
  balance: number;
  balanceDate: Date;
  connectionSource: string;
  currency: string;
  type: AccountType;
  usage: AccountUsage;
  reference?: string;
  bank?: string;
  status?: AccountStatus;
  iban?: string;
  bic?: string;
  name?: string;
  savingsDetails?: string;
  loanDetails?: LoanDetails;
};

export type LoanDetails = {
  type?: LoanDetailsType;
  amount?: number;
  startDate?: Date;
  endDate?: Date;
  payment?: number;
  remainingCapital?: number;
  interestRate?: number;
  debitedAccountId?: string;
};

export enum AccountType {
  CHECKINGS = 'CHECKINGS',
  SAVINGS = 'SAVINGS',
  LOAN = 'LOAN',
  CREDIT_CARD = 'CREDIT_CARD',
}

export enum AccountUsage {
  PROFESSIONAL = 'PROFESSIONAL',
  PERSONAL = 'PERSONAL',
}

export enum AccountStatus {
  MANUAL = 'MANUAL',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CLOSED = 'CLOSED',
}

export enum LoanDetailsType {
  AUTO = 'AUTO',
  CONSUMER = 'CONSUMER',
  CONSTRUCTION = 'CONSTRUCTION',
  MORTGAGE = 'MORTGAGE',
  OTHER = 'OTHER',
  HOMEEQUITY = 'HOMEEQUITY',
  COMMERCIAL = 'COMMERCIAL',
  STUDENT = 'STUDENT',
  MILITARY = 'MILITARY',
  SMB = 'SMB',
}
