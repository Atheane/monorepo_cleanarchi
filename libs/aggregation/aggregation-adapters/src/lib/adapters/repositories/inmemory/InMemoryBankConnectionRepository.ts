import {
  BankConnectionRepository,
  BankConnectionError,
  BankConnection,
  BankConnectionProperties,
} from '@oney/aggregation-core';
import { Dictionary } from '@oney/common-core';
import { injectable } from 'inversify';

@injectable()
export class InMemoryBankConnectionRepository implements BankConnectionRepository {
  constructor(private store: Map<string, BankConnectionProperties>) {}

  findBy(predicate: Dictionary<string>): Promise<BankConnection> {
    const predicateKeys = Object.keys(predicate) as [keyof BankConnectionProperties];
    const result: BankConnectionProperties = [...this.store.values()].find(item =>
      predicateKeys.every(key => item[key] === predicate[key]),
    );
    if (!result) {
      return Promise.reject(new BankConnectionError.BankConnectionNotFound());
    }
    return Promise.resolve(new BankConnection(result));
  }

  filterBy(predicate: Dictionary<string>): Promise<BankConnection[]> {
    const predicateKeys = Object.keys(predicate) as [keyof BankConnectionProperties];
    const results: BankConnection[] = [...this.store.values()]
      .filter(item => predicateKeys.every(key => item[key] === predicate[key]))
      .map(connection => new BankConnection(connection));
    return Promise.resolve(results);
  }

  async save(bankConnectionProperties: BankConnectionProperties): Promise<BankConnection> {
    const { refId, connectionId, state } = bankConnectionProperties;
    try {
      const existingBankConnection = await this.findBy({ refId });
      if (refId === existingBankConnection.props.refId && state === existingBankConnection.props.state) {
        return existingBankConnection;
      }
      this.store.set(connectionId, bankConnectionProperties);
      return await this.findBy({ connectionId });
    } catch (e) {
      this.store.set(connectionId, bankConnectionProperties);
      return this.findBy({ refId });
    }
  }

  async deleteOne(id: string): Promise<void> {
    const bankConnection = await this.findBy({ connectionId: id });
    this.store.delete(bankConnection.props.connectionId);
    this.store.delete(bankConnection.props.refId);
  }
}
