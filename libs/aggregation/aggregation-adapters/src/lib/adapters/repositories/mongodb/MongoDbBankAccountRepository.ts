import { Dictionary } from '@oney/common-core';
import { BankAccountRepository, BankAccount, BankAccountProperties } from '@oney/aggregation-core';
import { injectable } from 'inversify';
import { BankAccountModel } from './models/BankAccountModel';

@injectable()
export class MongoDbBankAccountRepository implements BankAccountRepository {
  private bankAccountModel = BankAccountModel;

  async save(props: Partial<BankAccountProperties>): Promise<BankAccount> {
    const result: BankAccountProperties = await this.bankAccountModel
      .findOneAndUpdate(
        {
          id: props.id,
        },
        { ...props, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
    return new BankAccount({ ...result });
  }

  async filterBy(predicate: Dictionary<string | boolean>): Promise<BankAccount[]> {
    const bankAccounts: BankAccountProperties[] = await this.bankAccountModel.find(predicate).lean();
    return bankAccounts.map(bankAccount => new BankAccount(bankAccount));
  }

  async deleteOne(id: string): Promise<void> {
    await this.bankAccountModel.deleteOne({ id });
  }
}
