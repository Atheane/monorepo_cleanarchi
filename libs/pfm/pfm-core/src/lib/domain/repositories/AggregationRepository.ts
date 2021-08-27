import { TransactionRepository } from './TransactionRepository';
import { Transaction } from '../entities/Transaction';
import { Event, OrderEnum } from '../types';

export interface AggregationRepository extends TransactionRepository {
  uniqBy(array: any[], getKey): any[];
  sortByDate(item: Event, nextItem: Event, order: OrderEnum): number;
  getByTransactionId(transactionId: string): Promise<Transaction>;
}
