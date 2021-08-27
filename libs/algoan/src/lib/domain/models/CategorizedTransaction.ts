import { Transaction } from './Transaction';

export type CategorizedTransaction = {
  id: string;
  refId: string;
  transactions: Transaction[];
};
