import { Dictionary } from '@oney/common-core';
import {
  BankConnectionProperties,
  BankConnectionRepository,
  BankConnection,
  BankConnectionError,
  BankField,
} from '@oney/aggregation-core';
import { injectable } from 'inversify';
import { BankConnectionModel } from './models/BankConnectionModel';

@injectable()
export class MongoDbBankConnectionRepository implements BankConnectionRepository {
  private bankConnectionModel = BankConnectionModel;

  async findBy(predicate: Dictionary<string>): Promise<BankConnection> {
    const result: BankConnectionProperties = await this.bankConnectionModel.findOne(predicate).lean();
    if (!result) {
      throw new BankConnectionError.BankConnectionNotFound();
    }
    return new BankConnection({
      form: result.form?.map(item => new BankField(item)),
      connectionId: result.connectionId,
      refId: result.refId,
      userId: result.userId,
      active: result.active,
      state: result.state,
      bankId: result.bankId,
      connectionDate: result.connectionDate,
    });
  }

  async filterBy(predicate: Dictionary<string>): Promise<BankConnection[]> {
    const bankConnections: BankConnectionProperties[] = await this.bankConnectionModel.find(predicate).lean();
    return bankConnections.map(bankConnection => {
      const form = bankConnection.form?.map(item => new BankField(item));
      return new BankConnection({
        form,
        connectionId: bankConnection.connectionId,
        refId: bankConnection.refId,
        userId: bankConnection.userId,
        active: bankConnection.active,
        state: bankConnection.state,
        bankId: bankConnection.bankId,
        connectionDate: bankConnection.connectionDate,
      });
    });
  }

  async save(bankConnectionProperties: BankConnectionProperties): Promise<BankConnection> {
    const result = await this.bankConnectionModel
      .findOneAndUpdate(
        {
          connectionId: bankConnectionProperties.connectionId,
        },
        { ...bankConnectionProperties, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
    return new BankConnection({
      form: result.form?.map(item => new BankField(item)),
      connectionId: result.connectionId,
      refId: result.refId,
      userId: result.userId,
      active: result.active,
      state: result.state,
      bankId: result.bankId,
      connectionDate: result.connectionDate,
    });
  }

  async deleteOne(id: string): Promise<void> {
    await this.bankConnectionModel.deleteOne({ connectionId: id });
  }
}
