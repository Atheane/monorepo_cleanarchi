export type BudgetInsightTransactionsResponse = {
  total: number;
  first_date: string;
  last_date: string;
  transactions: BudgetInsightTransaction[];
};

export type BudgetInsightTransactionEnriched = {
  transaction: BudgetInsightTransaction;
  connectionId: string;
};

export type BudgetInsightTransaction = {
  id: number;
  id_account: number;
  webid?: any;
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
  original_currency?: BudgetInsightCurrency;
  commission?: number;
  commission_currency?: BudgetInsightCurrency;
  country?: string;
  counterparty?: string;
  card?: string;
  category?: BudgetInsightCategory;
  type: BudgetInsightTransactionType;
  new: boolean;
  formatted_value: string;
  documents_count: number;
  nopurge: number;
};

export enum BudgetInsightTransactionType {
  TRANSFER = 'transfer',
  ORDER = 'order',
  CHECK = 'check',
  DEPOSIT = 'deposit',
  PAYBACK = 'payback',
  WITHDRAWAL = 'withdrawal',
  LOAN_PAYMENT = 'loan_payment',
  BANK = 'bank',
  CARD = 'card',
  DEFERRED_CARD = 'deferred_card',
  SUMMARY_CARD = 'summary_card',
}

type BudgetInsightCurrency = {
  id: string;
  symbol: string;
  prefix: boolean;
  crypto: boolean;
  precision: number;
  marketcap?: any;
  datetime?: Date;
  name: string;
};

type BudgetInsightCategory = {
  id: number;
  id_parent_category?: number;
  name: string;
  income?: any;
  color: string;
  id_parent_category_in_menu?: number;
  name_displayed: string;
  refundable: boolean;
  id_user?: number;
  id_logo?: any;
  hidden: boolean;
  accountant_account?: any;
};
