import { BankConnectionError } from '@oney/aggregation-core';
import { Dictionary } from '@oney/common-core';
import { injectable } from 'inversify';
import { BankConnection } from '../../domain/entities';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';

@injectable()
export class InMemoryBankConnectionRepository implements BankConnectionRepository {
  constructor(private store: Map<string, BankConnection>) {}

  findBy(predicate: Dictionary<string>): Promise<BankConnection> {
    const predicateKeys = Object.keys(predicate) as [keyof BankConnection];
    const result: BankConnection = [...this.store.values()].find(item =>
      predicateKeys.every(key => item[key] === predicate[key]),
    );
    if (!result) {
      return Promise.reject(new BankConnectionError.BankConnectionNotFound());
    }
    return Promise.resolve(result);
  }

  async save(bankConnection: BankConnection): Promise<BankConnection> {
    const { refId } = bankConnection;
    this.store.set(refId, bankConnection);
    return this.findBy({ refId });
  }
}
