enum EventTypeBudgetInsight {
  ACCOUNT_SYNC = 'ACCOUNT_SYNC',
}

export type EventBudgetInsight = {
  date: Date;
  type: EventTypeBudgetInsight;
  data: BankAccount;
  version: number;
};

export type BankAccount = {
  id: number;
  id_connection: number;
  id_user: number;
  id_source: number;
  id_parent?: number;
  number: string;
  webid?: string;
  original_name: string;
  balance: number;
  coming?: number;
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
  usage: AccountUsage;
  ownership: string;
  company_name?: string;
  bic?: string;
  coming_balance?: string;
  formatted_balance?: string;
  type: AccountType;
  information?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  loan?: Loan;
  transactions: TransactionBudgetInsight[];
};

export type TransactionBudgetInsight = {
  id: number;
  id_account: number;
  webid?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  application_date?: Date;
  date: Date;
  value: number;
  gross_value?: string;
  original_wording: string;
  simplified_wording: string;
  stemmed_wording?: string;
  wording?: string;
  id_category?: number;
  state?: string;
  date_scraped: Date;
  rdate: Date;
  vdate?: Date;
  bdate?: Date;
  coming: boolean;
  active: boolean;
  id_cluster?: number;
  comment?: string;
  last_update?: Date;
  deleted?: Date;
  original_value?: number;
  original_gross_value?: number;
  original_currency?: Currency;
  commission?: number;
  commission_currency?: Currency;
  country?: string;
  counterparty?: string;
  card?: string;
  category: Category;
  type: TransactionTypeBudgetInsight;
  new: boolean;
  formatted_value: string;
  documents_count: number;
  nopurge: number;
};

export enum TransactionTypeBudgetInsight {
  TRANSFER = 'transfer',
  ORDER = 'order',
  CHECK = 'check',
  DEPOSIT = 'deposit',
  PAYBACK = 'payback',
  WITHDRAWAL = 'withdrawal',
  LOAD_PAYMENT = 'loan_payment',
  BANK = 'bank',
  CARD = 'card',
  DEFERRED_CARD = 'deferred_card',
  SUMMARY_CARD = 'summary_card',
}

export type Currency = {
  id: string;
  symbol: string;
  prefix: boolean;
  crypto: boolean;
  precision: number;
  marketcap?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  datetime?: Date;
  name: string;
};

export type Category = {
  id: number;
  id_parent_category?: number;
  name: string;
  income?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  color: string;
  id_parent_category_in_menu?: number;
  name_displayed: string;
  refundable: boolean;
  id_user?: number;
  id_logo?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  hidden: boolean;
  accountant_account?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
};

export enum AccountType {
  UNKOWN = 1,
  CHECKING = 2,
  SAVINGS = 3,
  DEPOSIT = 4,
  LOAN = 5,
  MARKET = 6,
  JOINT = 7,
  CARD = 8,
  LIFEINSURANCE = 9,
  PEE = 10,
  PERCO = 11,
  ARTICLE83 = 12,
  RSP = 13,
  PEA = 14,
  CAPITALISATION = 15,
  PERP = 16,
  MADELIN = 17,
  MORTGAGE = 18,
  CONSUMERCREDIT = 19,
  REVOLVINGCREDIT = 20,
  PER = 21,
}

export enum AccountUsage {
  PRIV = 'PRIV',
  ORGA = 'ORGA',
  ASSO = 'ASSO',
}

export type Loan = {
  id: number;
  id_account: number;
  contact_name?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  total_amount: number;
  available_amount?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  used_amount?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  subscription_date?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  maturity_date?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  next_payment_amount: number;
  next_payment_date?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  rate?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  nb_payments_left?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  nb_payments_done?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  nb_payments_total?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  last_payment_amount?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  last_payment_date?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  account_label?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  insurance_label?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  duration?: any /* eslint-disable @typescript-eslint/no-explicit-any */;
  type: string;
};
