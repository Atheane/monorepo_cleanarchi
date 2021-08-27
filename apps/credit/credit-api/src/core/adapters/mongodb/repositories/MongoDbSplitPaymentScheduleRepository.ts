import * as mongoose from 'mongoose';
import { injectable } from 'inversify';
import {
  SplitPaymentScheduleRepository,
  SplitPaymentScheduleError,
  SplitPaymentScheduleProperties,
} from '@oney/credit-core';
import { SplitPaymentScheduleDoc } from '../models';
import { SplitPaymentScheduleMapper } from '../../mappers';

@injectable()
export class MongoDbSplitPaymentScheduleRepository implements SplitPaymentScheduleRepository {
  private model: mongoose.Model<SplitPaymentScheduleDoc>;
  private mapper: SplitPaymentScheduleMapper;

  constructor(model: mongoose.Model<SplitPaymentScheduleDoc>, mapper: SplitPaymentScheduleMapper) {
    this.model = model;
    this.mapper = mapper;
  }
  async save(
    paymentScheduleProperties: SplitPaymentScheduleProperties,
  ): Promise<SplitPaymentScheduleProperties> {
    return this.model
      .findOneAndUpdate(
        {
          id: paymentScheduleProperties.id,
        },
        { ...paymentScheduleProperties, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
  }

  async getByContractNumber(contractNumber: string): Promise<SplitPaymentScheduleProperties> {
    const result = await this.model
      .findOne({
        contractNumber,
      })
      .select('-_id')
      .lean();
    if (!result) {
      return Promise.reject(new SplitPaymentScheduleError.NotFound());
    }
    return this.mapper.toDomain(result);
  }

  async getByUserId(userId: string): Promise<SplitPaymentScheduleProperties[]> {
    const result = await this.model
      .find({
        userId,
      })
      .select('-_id')
      .lean();

    return result.map(paymentSchedule => this.mapper.toDomain(paymentSchedule));
  }
}
