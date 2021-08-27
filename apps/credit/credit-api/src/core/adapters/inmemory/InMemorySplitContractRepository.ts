import { injectable } from 'inversify';
import { ContractStatus } from '@oney/credit-messages';
import { SplitContractRepository, SplitContractError, SplitContractProperties } from '@oney/credit-core';

@injectable()
export class InMemorySplitContractRepository implements SplitContractRepository {
  constructor(private store: Map<string, SplitContractProperties>) {}

  save(contractProps: SplitContractProperties): Promise<SplitContractProperties> {
    this.store.set(contractProps.initialTransactionId, contractProps);

    return Promise.resolve(contractProps);
  }

  getByInitialTransactionId(initialTransactionId: string): Promise<SplitContractProperties> {
    const result = this.store.get(initialTransactionId);
    if (result) {
      return Promise.resolve(result);
    }
    return Promise.reject(new SplitContractError.NotFound());
  }

  getByContractNumber(contractNumber: string): Promise<SplitContractProperties> {
    const result = [...this.store.values()].filter(entry => entry.contractNumber === contractNumber);

    return Promise.resolve(result[0]);
  }

  getByUserId(userId: string): Promise<SplitContractProperties[]> {
    const result = [...this.store.values()].filter(entry => entry.userId === userId);

    return Promise.resolve(result);
  }

  getAll(status?: ContractStatus[]): Promise<SplitContractProperties[]> {
    if (!status || !status.length) {
      return Promise.resolve([...this.store.values()]);
    }

    const result = [...this.store.values()].filter(entry => status.includes(entry.status));

    return Promise.resolve(result);
  }
}
