import { SagaDefinitionDataModel, SagaDefinitionRepository } from '@oney/saga-core';
import { Model } from 'mongoose';
import { ActiveSagaMapper } from './ActiveSagaMapper';
import { SagaDefinitionDoc } from './schemas/SagaDefinitionSchema';

export class MongoSagaDefinitionRepository implements SagaDefinitionRepository {
  private _mapper: ActiveSagaMapper;
  private _model: Model<SagaDefinitionDoc>;

  constructor(model: Model<SagaDefinitionDoc>, mapper: ActiveSagaMapper) {
    this._mapper = mapper;
    this._model = model;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async persist(definition: SagaDefinitionDataModel) {
    throw new Error('NOT_IMPLEMENTED');
  }
}
