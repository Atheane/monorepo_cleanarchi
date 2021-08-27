import { EventHandlerExecutionDataModel, EventHandlerExecutionRepository } from '@oney/messages-core';
import { Model } from 'mongoose';
import { MongoEventHandlerExecutionFindOneMapper } from './MongoEventHandlerExecutionFindOneMapper';
import { EventHandlerExecutionDoc } from './schemas/EventHandlerExecutionSchema';

export class MongoEventHandlerExecutionRepository extends EventHandlerExecutionRepository {
  private readonly _model: Model<EventHandlerExecutionDoc>;

  constructor(model: Model<EventHandlerExecutionDoc>) {
    super();
    this._model = model;
  }

  public async persist(data: EventHandlerExecutionDataModel) {
    const existingEntity = await this._model.findOne({
      messageId: data.messageId,
      handlerUniqueIdentifier: data.handlerUniqueIdentifier,
    });

    if (existingEntity) {
      return await this._model
        .replaceOne(
          {
            _id: {
              $eq: existingEntity._id,
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

  public async findOne(
    messageId: string,
    handlerUniqueIdentifier: string,
  ): Promise<EventHandlerExecutionDataModel | undefined> {
    const result = await this._model
      .findOne({
        messageId: messageId,
        handlerUniqueIdentifier: handlerUniqueIdentifier,
      })
      .lean()
      .exec();

    return MongoEventHandlerExecutionFindOneMapper.findOneResultToModel(result);
  }
}
