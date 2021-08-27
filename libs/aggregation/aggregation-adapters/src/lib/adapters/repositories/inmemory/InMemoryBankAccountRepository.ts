import { BankAccountRepository, BankAccount, BankAccountProperties } from '@oney/aggregation-core';
import { Dictionary } from '@oney/common-core';
import { injectable } from 'inversify';

@injectable()
export class InMemoryBankAccountRepository implements BankAccountRepository {
  constructor(private store: Map<string, BankAccountProperties>) {}

  async save(props: Partial<BankAccountProperties>): Promise<BankAccount> {
    const existingBankAccount = await this.filterBy({ id: props.id })[0];
    const updatedBankAccount = new BankAccount({ ...existingBankAccount, ...props });
    this.store.set(props.id, updatedBankAccount.props);
    return updatedBankAccount;
  }

  filterBy(predicate: Dictionary<string>): Promise<BankAccount[]> {
    const predicateKeys = Object.keys(predicate) as [keyof BankAccount];
    const results: BankAccount[] = [...this.store.values()]
      .filter(item => predicateKeys.every(key => item[key] === predicate[key]))
      .map(account => new BankAccount({ ...account }));
    return Promise.resolve(results);
  }

  async deleteOne(id: string): Promise<void> {
    const bankAccountProps = this.store.get(id);
    this.store.delete(bankAccountProps.id);
  }
}
