import { EventHandlerExecutionDataModel } from './models/EventHandlerExecutionDataModel';

export abstract class EventHandlerExecutionRepository {
  abstract persist(data: EventHandlerExecutionDataModel);

  abstract findOne(
    messageId: string,
    handlerUniqueIdentifier: string,
  ): Promise<EventHandlerExecutionDataModel | undefined>;
}
