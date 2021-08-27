/* eslint-disable @typescript-eslint/no-explicit-any */
import { Currency } from './Currency';

export type Transaction = {
  id: number;
  id_account: number;
  webid?: any;
  application_date?: Date;
  date: string;
  value: number;
  gross_value?: string;
  original_wording: string;
  simplified_wording: string;
  stemmed_wording?: string;
  wording?: string;
  id_category?: number;
  state?: string;
  date_scraped: Date;
  rdate: string;
  vdate?: string;
  bdate?: string;
  coming: boolean;
  active: boolean;
  id_cluster?: number;
  comment?: string;
  last_update?: string;
  deleted?: string;
  original_value?: number;
  original_gross_value?: number;
  original_currency?: Currency;
  commission?: number;
  commission_currency?: Currency;
  country?: string;
  counterparty?: string;
  card?: string;
  category: Category;
  type: TransactionType;
  new: boolean;
  formatted_value: string;
  documents_count: number;
  nopurge: number;
};

export enum TransactionType {
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

export type Category = {
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
