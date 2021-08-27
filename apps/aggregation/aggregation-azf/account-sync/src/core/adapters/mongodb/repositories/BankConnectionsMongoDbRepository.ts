import { Model, Connection } from 'mongoose';
import { Dictionary } from '@oney/common-core';
import { BankConnectionError } from '@oney/aggregation-core';
import { BankConnection } from '../../../domain/entities/BankConnection';
import { BankConnectionRepository } from '../../../domain/repositories/BankConnectionRepository';
import { getBankConnectionModel, BankConnectionDoc } from '../models/BankConnections';

export class BankConnectionsMongoDbRepository implements BankConnectionRepository {
  private readonly bankConnectionModel: Model<BankConnectionDoc>;

  constructor(dbConnection: Connection) {
    this.bankConnectionModel = getBankConnectionModel(dbConnection);
  }

  async findBy(predicate: Dictionary<string>): Promise<BankConnection> {
    const result = await this.bankConnectionModel.findOne(predicate).lean();
    if (!result) {
      throw new BankConnectionError.BankConnectionNotFound();
    }
    return new this.bankConnectionModel({
      refId: result.refId,
      userId: result.userId,
      bankId: result.bankId,
    });
  }

  async save(bankConnection: BankConnection): Promise<BankConnection> {
    const result = await this.bankConnectionModel.create(bankConnection);
    return new this.bankConnectionModel({
      refId: result.refId,
      userId: result.userId,
      bankId: result.bankId,
    });
  }
}
