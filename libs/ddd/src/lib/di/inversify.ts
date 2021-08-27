import { DefaultEventProducerDispatcher } from '@oney/messages-adapters';
import { EventDispatcher, EventProducerDispatcher, EventReceiver } from '@oney/messages-core';
import { Container } from 'inversify';
import { MessagingPlugin } from '../domain/services/MessagingPlugin';

export function buildDomainEventDependencies(container: Container) {
  return {
    usePlugin(messagingPlugin: MessagingPlugin) {
      container.bind(EventDispatcher).toConstantValue(messagingPlugin.dispatcher);
      container
        .bind(EventProducerDispatcher)
        .toConstantValue(new DefaultEventProducerDispatcher(messagingPlugin.dispatcher));
      container.bind(EventReceiver).toConstantValue(messagingPlugin.receiver);
    },
  };
}
