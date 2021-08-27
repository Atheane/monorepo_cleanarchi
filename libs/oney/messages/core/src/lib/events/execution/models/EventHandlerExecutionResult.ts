import { EventHandlerExecutionContext } from './EventHandlerExecutionContext';
import { EventHandlerExecutionStatus } from './EventHandlerExecutionStatus';

export class EventHandlerExecutionResult {
  constructor(context: EventHandlerExecutionContext) {
    this.context = context;
  }

  context: EventHandlerExecutionContext;

  get completed(): boolean {
    return (
      this.context.execution.status === EventHandlerExecutionStatus.COMPLETED ||
      this.context.execution.status === EventHandlerExecutionStatus.NOT_MATCHED
    );
  }
}
