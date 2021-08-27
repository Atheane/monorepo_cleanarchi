import { EventHandlerExecutionDoc } from '@oney/az-servicebus-adapters';
import { EventHandlerExecutionDataModel } from '@oney/messages-core';

export class MongoEventHandlerExecutionFindOneMapper {
  static findOneResultToModel(
    input: Pick<
      EventHandlerExecutionDoc,
      '_id' | 'messageId' | 'handlerUniqueIdentifier' | 'createdAt' | 'updatedAt' | 'completedAt' | 'history'
    >,
  ): EventHandlerExecutionDataModel | undefined {
    if (!input) return undefined;

    const result = {
      ...input,
    };

    delete result._id;

    return result;
  }
}
