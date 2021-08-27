import {
  EventHandler,
  EventHandlerExecutionStrategy,
  EventMessageBodyMapper,
  EventMessageBodySerializer,
  EventMetadata,
} from '@oney/messages-core';

export class EventHandlerSubscription {
  topic: string;
  subscription: string;
  eventMetadata: EventMetadata;
  handler: EventHandler;
  handlerUniqueIdentifier: string;
  mapper: EventMessageBodyMapper;
  serializer: EventMessageBodySerializer;
  executionStrategy: EventHandlerExecutionStrategy;
}
