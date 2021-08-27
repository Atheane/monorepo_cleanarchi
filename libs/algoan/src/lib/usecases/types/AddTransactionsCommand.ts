import { TransactionProperties } from '../../domain/models/Transaction';

export type AddTransactionsCommand = {
  transactions: TransactionProperties[];
  accountId: string;
  bankUserId: string;
};
