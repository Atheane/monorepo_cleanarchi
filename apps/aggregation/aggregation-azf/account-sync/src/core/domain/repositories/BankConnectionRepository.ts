import { Dictionary } from '@oney/common-core';
import { BankConnection } from '../entities';

export interface BankConnectionRepository {
  findBy(predicate: Dictionary<string>): Promise<BankConnection>;
  save(bankConnection: BankConnection): Promise<BankConnection>;
}
