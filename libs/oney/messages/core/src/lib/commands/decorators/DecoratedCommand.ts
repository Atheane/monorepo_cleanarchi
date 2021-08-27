import { defaultLogger } from '@oney/logger-adapters';
import { DecoratedMessage } from '../../messages/decorators/DecoratedMessage';
import { CommandMetadata } from '../metadata/CommandMetadata';
import { StaticCommandRegistry } from '../metadata/StaticCommandRegistry';

export type DecoratedCommandData = {
  name: string;
  version: number;
  namespace: string;
};

export function DecoratedCommand(data: DecoratedCommandData) {
  return target => {
    // forward DecoratedMessage decorator
    DecoratedMessage(data)(target);

    const metadata = CommandMetadata.ensure(target);

    // set the global metadata
    metadata.name = data.name;
    metadata.version = data.version;
    metadata.namespace = data.namespace;

    if (!StaticCommandRegistry.has(data.namespace, data.name, data.version)) {
      StaticCommandRegistry.register(target);
    } else {
      const message = `Multiple command with same metadata has been registered: ${metadata.fullyQualifiedName}`;
      defaultLogger.error(message, metadata);
      throw new Error(message);
    }
  };
}
