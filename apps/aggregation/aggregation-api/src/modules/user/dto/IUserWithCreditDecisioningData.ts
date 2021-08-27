import { TransactionProperties } from '@oney/aggregation-core';

export interface IUserWithCreditDecisioningData {
  creditDecisioningUserId: string;
  unsavedTransactions: TransactionProperties[];
}
