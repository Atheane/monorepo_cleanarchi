import { ReceivedMessageInfo } from '@azure/service-bus';
import {
  EventHandlerExecutionFinder,
  EventHandlerExecutionStrategy,
  EventHandlerSubscription,
} from '@oney/messages-core';

export class IdempotentEventHandlerExecutionStrategy extends EventHandlerExecutionStrategy {
  private _finder: EventHandlerExecutionFinder;
  constructor(finder: EventHandlerExecutionFinder) {
    super();
    this._finder = finder;
  }

  public match(message: ReceivedMessageInfo, subscription: EventHandlerSubscription) {
    const metadata = subscription.eventMetadata;

    // complex condition to keep the support of legacy events
    if (message.userProperties == null) {
      return message.label === metadata.name;
    }

    return (
      // only required name matching
      (message.userProperties.name === metadata.name || message.label === metadata.name) &&
      (message.userProperties.namespace == null || message.userProperties.namespace === metadata.namespace) &&
      (message.userProperties.version == null || message.userProperties.version === metadata.version)
    );
  }

  public async shouldExecute(message: ReceivedMessageInfo, subscription: EventHandlerSubscription) {
    const entry = await this._finder.find(message.messageId.toString(), subscription.handlerUniqueIdentifier);

    if (!entry) {
      return true;
    }

    return entry.completedAt == null;
  }
}
