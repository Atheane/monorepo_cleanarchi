import * as mongoose from 'mongoose';
import { injectable } from 'inversify';
import {
  SplitSimulationRepository,
  SplitSimulationProperties,
  SplitSimulationError,
} from '@oney/credit-core';
import { SplitSimulationMapper } from '../../mappers';
import { SplitSimulationDoc } from '../models';

@injectable()
export class MongoDbSplitSimulationRepository implements SplitSimulationRepository {
  private model: mongoose.Model<SplitSimulationDoc>;
  private mapper: SplitSimulationMapper;

  constructor(model: mongoose.Model<SplitSimulationDoc>, mapper: SplitSimulationMapper) {
    this.model = model;
    this.mapper = mapper;
  }

  async save(simulationProps: SplitSimulationProperties): Promise<SplitSimulationProperties> {
    const result = await this.model
      .findOneAndUpdate(
        {
          initialTransactionId: simulationProps.initialTransactionId,
          productCode: simulationProps.productCode,
        },
        { ...simulationProps, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
    return this.mapper.toDomain(result);
  }

  async getById(id: string): Promise<SplitSimulationProperties> {
    const result = await this.model
      .findOne({
        id,
      })
      .select('-_id')
      .lean();
    if (!result) {
      throw new SplitSimulationError.NotFound();
    }
    return this.mapper.toDomain(result);
  }
}
