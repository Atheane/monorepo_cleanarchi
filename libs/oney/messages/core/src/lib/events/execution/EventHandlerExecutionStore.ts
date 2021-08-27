import { EventHandlerExecutionContext } from './models/EventHandlerExecutionContext';

export abstract class EventHandlerExecutionStore {
  abstract ensure(context: EventHandlerExecutionContext);

  abstract updateHistory(context: EventHandlerExecutionContext);
}
