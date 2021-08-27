import { defaultLogger } from '@oney/logger-adapters';
import { Model, Connection } from 'mongoose';
import { Creditor, CreditorRepository, CreditorProperties, CreditorError } from '@oney/credit-core';
import { CreditorDoc, getCreditorModel } from '../models/CreditorModel';

export class MongoDbCreditorRepository implements CreditorRepository {
  private readonly creditorModel: Model<CreditorDoc>;

  constructor(dbConnection: Connection) {
    this.creditorModel = getCreditorModel(dbConnection);
  }

  async create(CreditorProperties: CreditorProperties): Promise<Creditor> {
    try {
      const result = await this.creditorModel.create(CreditorProperties);
      return new Creditor({
        userId: result.userId,
        isEligible: result.isEligible,
      });
    } catch (e) {
      defaultLogger.info('MongoDbCreditorRepository.create', e);
      throw new CreditorError.AlreadyExists();
    }
  }

  async findBy(userId: string): Promise<Creditor> {
    const creditor: CreditorProperties = await this.creditorModel.findOne({ userId }).lean();
    if (!creditor) {
      defaultLogger.info('MongoDbCreditorRepository.findBy', 'CreditorError.UserNotFound');
      throw new CreditorError.UserNotFound();
    }
    return new Creditor({
      userId: creditor.userId,
      isEligible: creditor.isEligible,
    });
  }

  async save(creditorProps: CreditorProperties): Promise<Creditor> {
    const creditor = await this.creditorModel
      .findOneAndUpdate(
        {
          userId: creditorProps.userId,
        },
        { ...creditorProps, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
    return new Creditor({
      userId: creditor.userId,
      isEligible: creditor.isEligible,
    });
  }
}
