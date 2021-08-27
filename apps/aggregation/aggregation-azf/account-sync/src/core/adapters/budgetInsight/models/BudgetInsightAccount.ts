/* eslint-disable @typescript-eslint/no-explicit-any */
import { BudgetInsightBankConnection } from '@oney/aggregation-adapters';
import { Bank } from './Bank';
import { Currency } from './Currency';
import { Loan } from './Loan';
import { Transaction } from './Transaction';

export interface BudgetInsightGetAccountsResponse {
  total: number;
  balance: number;
  balances: any;
  coming_balances: any;
  accounts: BudgetInsightAccount[];
}

export interface BudgetInsightAccount {
  id: number;
  id_connection: number | null;
  id_user: number | null;
  id_source?: number;
  id_parent?: number;
  userId: string;
  bank?: Bank;
  number: string;
  webid?: string;
  original_name: string;
  balance: number | null;
  coming: number | null;
  display: boolean;
  last_update?: Date;
  deleted?: Date;
  disabled?: Date | null;
  iban?: string;
  currency: Currency;
  id_type: number;
  bookmarked: number;
  name: string;
  error?: string;
  usage: string;
  ownership: string;
  company_name?: string;
  bic?: string;
  coming_balance?: number;
  formatted_balance?: string;
  type: string;
  information: any;
  loan?: Loan;
  transactions: Transaction[];
  connection?: BudgetInsightBankConnection;
}
