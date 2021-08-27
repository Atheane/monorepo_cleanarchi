import { Dictionary } from '@oney/common-core';
import { BankConnection, BankConnectionProperties } from '../aggregates/BankConnection';

export interface BankConnectionRepository {
  save(bankConnectionProperties: BankConnectionProperties): Promise<BankConnection>;
  findBy(predicate: Dictionary<string>): Promise<BankConnection>;
  filterBy(predicate: Dictionary<string>): Promise<BankConnection[]>;
  deleteOne(id: string): Promise<void>;
}
