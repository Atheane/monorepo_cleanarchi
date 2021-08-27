import * as mongoose from 'mongoose';
import { injectable } from 'inversify';
import { ContractStatus } from '@oney/credit-messages';
import { SplitContractRepository, SplitContractProperties, SplitContractError } from '@oney/credit-core';
import { SplitContractMapper } from '../../mappers';
import { SplitContractDoc } from '../models';

@injectable()
export class MongoDbSplitContractRepository implements SplitContractRepository {
  private model: mongoose.Model<SplitContractDoc>;
  private mapper: SplitContractMapper;

  constructor(model: mongoose.Model<SplitContractDoc>, mapper: SplitContractMapper) {
    this.model = model;
    this.mapper = mapper;
  }

  async save(contractProps: SplitContractProperties): Promise<SplitContractProperties> {
    return this.model
      .findOneAndUpdate(
        {
          contractNumber: contractProps.contractNumber,
        },
        { ...contractProps, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
  }

  async getByInitialTransactionId(initialTransactionId: string): Promise<SplitContractProperties> {
    const result = await this.model
      .findOne({
        initialTransactionId,
      })
      .select('-_id')
      .lean();
    if (!result) {
      throw new SplitContractError.NotFound();
    }
    return this.mapper.toDomain(result);
  }

  async getByContractNumber(contractNumber: string): Promise<SplitContractProperties> {
    const result = await this.model
      .findOne({
        contractNumber,
      })
      .select('-_id')
      .lean();
    if (!result) {
      throw new SplitContractError.NotFound();
    }
    return this.mapper.toDomain(result);
  }

  async getByUserId(userId: string): Promise<SplitContractProperties[]> {
    const result = await this.model
      .find({
        userId,
      })
      .select('-_id')
      .lean();

    return result.map(contract => this.mapper.toDomain(contract));
  }

  async getAll(status?: ContractStatus[]): Promise<SplitContractProperties[]> {
    const payload: { status? } = {};
    if (status) {
      payload.status = { $in: status };
    }
    const result = await this.model.find(payload).select('-_id').lean();

    return result.map(contract => this.mapper.toDomain(contract));
  }
}
