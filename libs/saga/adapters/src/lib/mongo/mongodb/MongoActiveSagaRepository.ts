import { ActiveSagaDataModel, ActiveSagaRepository, FindOptions, SagaState } from '@oney/saga-core';
import { Model } from 'mongoose';
import { ActiveSagaDoc } from './schemas/ActiveSagaSchema';

export class MongoActiveSagaRepository implements ActiveSagaRepository {
  private _model: Model<ActiveSagaDoc>;

  constructor(model: Model<ActiveSagaDoc>) {
    this._model = model;
  }

  public async persist<TSagaState extends SagaState>(data: ActiveSagaDataModel<TSagaState>) {
    const existingSaga = await this._model.findOne({ activeSagaId: data.activeSagaId });

    if (existingSaga) {
      return await this._model
        .replaceOne(
          {
            _id: {
              $eq: existingSaga._id,
            },
          },
          data,
        )
        .exec();
    } else {
      const result = await this._model.create(data);

      return new this._model({
        ...result,
      });
    }
  }

  public async find<TSagaState extends SagaState>(
    namespace: string,
    id: string,
    version: number,
    option: FindOptions = FindOptions.BOTH,
  ): Promise<ActiveSagaDataModel<TSagaState>[]> {
    let completedAtCondition = undefined;

    if (option === FindOptions.COMPLETED) {
      completedAtCondition = { 'instance.completedAt': { $exists: true, $ne: null } };
    } else if (option === FindOptions.NOT_COMPLETED) {
      completedAtCondition = {
        $or: [{ 'instance.completedAt': { $exists: false } }, { 'instance.completedAt': { $eq: null } }],
      };
    }

    const result = await this._model
      .find({
        'definition.saga.namespace': namespace,
        'definition.saga.id': id,
        'definition.saga.version': version,
        ...completedAtCondition,
      })
      .lean()
      .exec();

    // todo find a better method
    return (result as unknown) as ActiveSagaDataModel<TSagaState>[];
  }
}
