import { ReceivedMessageInfo } from '@azure/service-bus';
import { EventHandlerSubscription } from '@oney/messages-core';
import { AsyncOrSync } from 'ts-essentials';

export abstract class EventHandlerExecutionStrategy {
  abstract match(message: ReceivedMessageInfo, subscription: EventHandlerSubscription): AsyncOrSync<boolean>;

  abstract shouldExecute(
    message: ReceivedMessageInfo,
    subscription: EventHandlerSubscription,
  ): AsyncOrSync<boolean>;
}
