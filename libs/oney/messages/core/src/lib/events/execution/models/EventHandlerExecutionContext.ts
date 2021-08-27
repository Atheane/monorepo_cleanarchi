import { ReceivedMessageInfo } from '@azure/service-bus';
import { EventHandlerExecutionStatus } from './EventHandlerExecutionStatus';
import { EventHandlerSubscription } from './EventHandlerSubscription';

export interface EventHandlerExecutionContext {
  executionId: string;
  message: ReceivedMessageInfo;
  subscription: EventHandlerSubscription;
  execution: {
    beginsAt: Date;
    endsAt: Date;
    status: EventHandlerExecutionStatus;
    handleError?: Error;
    executeError?: Error;
  };
}
