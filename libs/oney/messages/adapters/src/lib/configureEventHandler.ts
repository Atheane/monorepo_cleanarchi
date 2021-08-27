import {
  EventHandlerRegistry,
  EventReceiver,
  SymTopicProviderFromEventCtor,
  SymTopicProviderFromEventInstance,
} from '@oney/messages-core';
import { Container } from 'inversify';
import { EventManager } from './EventManager';
import { DefaultTopicProviderFromEvent } from './events/DefaultTopicProviderFromEvent';
import { DefaultEventHandlerRegistry } from './events/DefaultEventHandlerRegistry';
import { TopicProviderFromRegistration } from './events/TopicProviderFromRegistration';

export type EventManagerRegister = Pick<EventManager, 'register'>;

export async function configureEventHandler(
  container: Container,
  registration: (em: EventManagerRegister) => void,
): Promise<void> {
  const receiver = container.get(EventReceiver);
  const topicProviderFromEvent = new DefaultTopicProviderFromEvent();
  const topicProvider = new TopicProviderFromRegistration(topicProviderFromEvent);
  const registry = new DefaultEventHandlerRegistry();
  const eventManager = new EventManager(container, receiver, registry, topicProvider);

  if (!container.isBound(TopicProviderFromRegistration)) {
    container.bind(TopicProviderFromRegistration).toConstantValue(topicProvider);
  }
  if (!container.isBound(DefaultTopicProviderFromEvent)) {
    container.bind(DefaultTopicProviderFromEvent).toConstantValue(topicProviderFromEvent);
  }
  if (!container.isBound(SymTopicProviderFromEventInstance)) {
    container.bind(SymTopicProviderFromEventInstance).toConstantValue(topicProviderFromEvent);
  }
  if (!container.isBound(SymTopicProviderFromEventCtor)) {
    container.bind(SymTopicProviderFromEventCtor).toConstantValue(topicProviderFromEvent);
  }

  if (!container.isBound(EventHandlerRegistry)) {
    container.bind(EventHandlerRegistry).toConstantValue(registry);
  }
  if (!container.isBound(DefaultEventHandlerRegistry)) {
    container.bind(DefaultEventHandlerRegistry).toConstantValue(registry);
  }
  if (!container.isBound(EventManager)) {
    container.bind(EventManager).toConstantValue(eventManager);
  }

  registration(eventManager);

  await eventManager.start();
}
