import { EventHandlerExecutionDataModel } from './models/EventHandlerExecutionDataModel';

export abstract class EventHandlerExecutionFinder {
  abstract find(
    messageId: string,
    handlerUniqueIdentifier: string,
  ): Promise<EventHandlerExecutionDataModel | undefined>;
}
