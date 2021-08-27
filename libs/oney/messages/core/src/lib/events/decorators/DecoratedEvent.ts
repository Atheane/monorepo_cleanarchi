import { defaultLogger } from '@oney/logger-adapters';
import { DecoratedMessage } from '../../messages/decorators/DecoratedMessage';
import { EventMetadata } from '../metadata/EventMetadata';
import { StaticEventRegistry } from '../metadata/StaticEventRegistry';

export type DecoratedEventData = {
  name: string;
  version: number;
  namespace?: string;
};

export function DecoratedEvent(data: DecoratedEventData) {
  return target => {
    // forward DecoratedMessage decorator
    DecoratedMessage(data)(target);

    const metadata = EventMetadata.ensure(target);

    // set the global metadata
    metadata.name = data.name;
    metadata.version = data.version;
    metadata.namespace = data.namespace;

    if (!StaticEventRegistry.has(data.namespace, data.name, data.version)) {
      StaticEventRegistry.register(target);
    } else {
      defaultLogger.warn('Multiple event with same metadata has been registered', metadata);
    }
  };
}
