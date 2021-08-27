import { TransactionSource } from '@oney/common-core';
import { Transaction } from '../entities/Transaction';
import { TransactionQueryType } from '../types/TransactionQuery';

export interface TransactionService {
  getTransactionById({
    userId,
    userToken,
    transactionId,
  }: {
    userId: string;
    userToken: string;
    transactionId: string;
  }): Promise<Transaction>;
  // odb_transaction does not provided a transaction details route
  getAllTransactions({
    accountsIds,
    userId,
    userToken,
    options,
    transactionSources,
  }: {
    accountsIds: string[];
    userId?: string;
    userToken?: string;
    options?: TransactionQueryType;
    transactionSources?: TransactionSource[];
  }): Promise<Transaction[]>;
  // We add the token in not required because we get the transaction from SMoney by a call to odb_transaction
  getTransactionsByAccountId({
    accountId,
    userId,
    userToken,
    options,
  }: {
    accountId: string;
    userId?: string;
    userToken?: string;
    options?: TransactionQueryType;
  }): Promise<Transaction[]>;
}
