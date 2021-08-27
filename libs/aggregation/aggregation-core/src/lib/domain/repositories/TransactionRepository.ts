import { Dictionary } from '@oney/common-core';
import { Transaction } from '../entities/Transaction';

export interface TransactionRepository {
  getAll(): Promise<Transaction[]>;
  filterBy(predicate: Dictionary<string>): Promise<Transaction[]>;
}
