import { TransactionSource } from '@oney/common-core';

export interface GetAllTransactionRequest {
  uid: string;
  holder: string;
  query?: {
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: string;
    transactionSources?: TransactionSource[];
  };
  withoutAggregateTransaction?: boolean;
}
