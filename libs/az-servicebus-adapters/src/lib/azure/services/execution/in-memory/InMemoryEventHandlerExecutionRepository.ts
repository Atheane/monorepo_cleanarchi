import { EventHandlerExecutionDataModel, EventHandlerExecutionRepository } from '@oney/messages-core';
import * as _ from 'lodash';

export class InMemoryEventHandlerExecutionRepository extends EventHandlerExecutionRepository {
  private _collection: EventHandlerExecutionDataModel[];

  constructor() {
    super();
    this._collection = [];
  }

  public async persist(data: EventHandlerExecutionDataModel) {
    const existingEntity = await this._collection.find(
      x => x.messageId === data.messageId && x.handlerUniqueIdentifier === data.handlerUniqueIdentifier,
    );

    const clone = _.cloneDeep(data);

    if (existingEntity) {
      existingEntity.completedAt = clone.completedAt;
      existingEntity.history = clone.history;
      existingEntity.createdAt = clone.createdAt;
      existingEntity.updatedAt = clone.updatedAt;
    } else {
      this._collection.push(clone);
    }
  }

  public async findOne(
    messageId: string,
    handlerUniqueIdentifier: string,
  ): Promise<EventHandlerExecutionDataModel | undefined> {
    const result = this._collection.find(
      x => x.messageId === messageId && x.handlerUniqueIdentifier === handlerUniqueIdentifier,
    );

    // todo find a better method
    return result;
  }
}
