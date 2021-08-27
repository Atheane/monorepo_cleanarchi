import { Queue } from '@oney/core';
import {
  QueueProviderFromCommandInstance,
  QueueProviderFromCommandCtor,
  CommandCtor,
  Command,
  CommandMetadata,
  CommandHandlerRegistry,
} from '@oney/messages-core';
import { injectable } from 'inversify';
import { assert } from 'ts-essentials';

@injectable()
export class DefaultQueueProviderFromCommand
  implements QueueProviderFromCommandInstance, QueueProviderFromCommandCtor {
  private _registry: CommandHandlerRegistry;
  private _mapping: Map<string, string>;

  constructor(registry: CommandHandlerRegistry) {
    this._registry = registry;
    this._mapping = new Map<string, string>();
  }

  addNamespaceMapping(namespace: string, queue: Queue) {
    this._mapping.set(namespace, queue);
  }

  async getQueue<TCommand extends Command>(command: TCommand): Promise<Queue>;
  async getQueue<TCommand extends Command>(command: CommandCtor<TCommand>): Promise<Queue>;
  async getQueue<TCommand extends Command>(command: TCommand | CommandCtor<TCommand>): Promise<Queue> {
    // todo it should be optimize
    const registry = await this._registry.read();

    let metadata: CommandMetadata<TCommand>;
    if (command instanceof Function) {
      metadata = CommandMetadata.getFromCtor(command);
    } else {
      metadata = CommandMetadata.getFromInstance(command);
    }

    const registryEntry = registry.find(x => x.command === metadata.target);

    const queueFromOptions = registryEntry.options?.queue;
    if (queueFromOptions) {
      return queueFromOptions;
    }

    assert(metadata.namespace);

    const queueFromMapping = this._mapping.get(metadata.namespace);

    if (queueFromMapping) {
      return queueFromOptions;
    }

    return metadata.namespace;
  }
}
