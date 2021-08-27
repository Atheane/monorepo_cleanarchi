import { injectable } from 'inversify';
import { SplitContractRepository, SplitContract, SplitContractError } from '../../../../core/src/domain';

@injectable()
export class InMemorySplitContractRepository implements SplitContractRepository {
  constructor(private store: Map<string, SplitContract>) {}

  save(contract: SplitContract): Promise<SplitContract> {
    this.store.set(contract.props.contractNumber, contract);
    return Promise.resolve(contract);
  }

  getByContractNumber(contractNumber: string): Promise<SplitContract> {
    const result = this.store.get(contractNumber);
    if (result) {
      return Promise.resolve(result);
    }
    return Promise.reject(new SplitContractError.NotFound());
  }
}
