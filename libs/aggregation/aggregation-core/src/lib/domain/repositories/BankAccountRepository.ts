import { Dictionary } from '@oney/common-core';
import { BankAccount, BankAccountProperties } from '../aggregates/BankAccount';

export interface BankAccountRepository {
  save(BankAccountProperties: Partial<BankAccountProperties>): Promise<BankAccount>;
  filterBy(predicate: Dictionary<string | boolean>): Promise<BankAccount[]>;
  deleteOne(id: string): Promise<void>;
}
