import { EventHandlerSubscription } from '@oney/messages-core';

export class EventHandlerSubscriptionMapper {
  static toLog(sub: EventHandlerSubscription) {
    return {
      topic: sub.topic,
      subscription: sub.subscription,
      eventMetadata: sub.eventMetadata,
      handler: sub.handler.constructor.name,
      handlerUniqueIdentifier: sub.handlerUniqueIdentifier,
      mapper: sub.mapper.constructor.name,
      serializer: sub.serializer.constructor.name,
      executionStrategy: sub.executionStrategy.constructor.name,
    };
  }
}
