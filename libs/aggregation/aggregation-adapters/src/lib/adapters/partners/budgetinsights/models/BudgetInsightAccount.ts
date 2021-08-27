import { BIConnector } from './Connector';

export interface Loan {
  id: number;
  id_account: number;
  contact_name?: string;
  total_amount: number;
  available_amount?: number;
  used_amount?: number;
  subscription_date?: string;
  maturity_date?: string;
  next_payment_amount: number;
  next_payment_date?: string;
  rate?: number;
  nb_payments_left?: number;
  nb_payments_done?: number;
  nb_payments_total?: number;
  last_payment_amount?: number;
  last_payment_date?: string;
  account_label?: string;
  insurance_label?: string;
  duration?: number;
  type: string;
}

interface Currency {
  id: string;
  symbol: string;
  prefix: boolean;
  crypto: boolean;
  precision: number;
  marketcap?: string;
  datetime?: string;
  name: string;
}

export interface Connection {
  id: number;
  id_user: number;
  id_connector: number;
  last_update: Date | null;
  created: Date | null;
  active: boolean;
  last_push: Date | null;
  next_try: Date | null;
  connector?: BIConnector;
}

export interface BudgetInsightAccount {
  id: number;
  id_connection: number;
  id_user: number;
  id_source: number;
  id_parent?: number;
  number: string | null;
  webid?: string;
  original_name: string;
  balance: number;
  coming: number;
  display: boolean;
  last_update?: Date;
  deleted?: Date;
  disabled?: string;
  iban?: string;
  currency: Currency;
  id_type: number;
  bookmarked: number;
  name: string;
  error?: string;
  usage: BudgetInsightAccountUsage;
  ownership: string;
  company_name?: string;
  bic?: string;
  coming_balance: number | null;
  formatted_balance?: string;
  type: string;
  information: object;
  loan?: Loan;
  connection?: Connection;
}

export enum BudgetInsightBankAccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  DEPOSIT = 'deposit',
  LOAN = 'loan',
  MARKET = 'market',
  JOINT = 'joint',
  CARD = 'card',
  LIFEINSURANCE = 'lifeinsurance',
  PEE = 'pee',
  PERCO = 'perco',
  ARTICLE83 = 'article83',
  RSP = 'rsp',
  PEA = 'pea',
  CAPITALISATION = 'capitalisation',
  PERP = 'perp',
  MADELIN = 'madelin',
  UNKNOWN = 'unknown',
}

export interface BudgetInsightAccountsResponse {
  total: number;
  balance: number;
  balances: object;
  coming_balances: object;
  accounts: BudgetInsightAccount[];
}

export enum FieldLabel {
  REGION = 'Région',
  ACCOUNT_TYPE = 'Type de compte',
  ACCESS_SITE = "Site d'accès",
}

export enum BudgetInsightAccountUsage {
  PRIV = 'PRIV',
  ORGA = 'ORGA',
  ASSO = 'ASSO',
}
