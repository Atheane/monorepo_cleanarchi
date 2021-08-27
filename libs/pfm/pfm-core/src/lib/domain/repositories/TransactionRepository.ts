import { Transaction } from '../entities/Transaction';
import { TransactionQueryType } from '../types/TransactionQuery';

export interface TransactionRepository {
  getAll?(accountId: string[], options?: TransactionQueryType): Promise<Transaction[]>;
  getByAccountId({
    accountId,
    userToken,
    options,
  }: {
    accountId: string;
    userToken?: string;
    options?: TransactionQueryType;
  }): Promise<Transaction[]>;
}
