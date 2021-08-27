import { Disposable } from '@oney/core';
import { defaultLogger } from '@oney/logger-adapters';
import {
  Command,
  CommandCtor,
  CommandHandlerActivator,
  CommandHandlerCtor,
  CommandMetadata,
  CommandReceiver,
  CommandReceiverOptions,
} from '@oney/messages-core';
import { injectable } from 'inversify';
import { AsyncOrSync } from 'ts-essentials';

@injectable()
export class TestCommandReceiver extends CommandReceiver {
  private _map: Map<CommandCtor, CommandHandlerCtor[]>;
  private _activator: CommandHandlerActivator;

  constructor(activator: CommandHandlerActivator) {
    super();
    this._map = new Map<CommandCtor, CommandHandlerCtor[]>();
    this._activator = activator;
  }

  public async inject(command: Command): Promise<void> {
    const metadata = CommandMetadata.getOrThrowFromInstance(command);
    const handlers = this.ensureMapEntry(metadata.target);

    for (const handler of handlers) {
      defaultLogger.info(`CommandHandler ${handler.name} activating`);

      const handlerInstance = this._activator.activate(handler);

      defaultLogger.info(`CommandHandler ${handler.name} executing`);

      await handlerInstance.handle(command, {});

      defaultLogger.info(`CommandHandler ${handler.name} executed`);
    }
  }

  public subscribe<TCommand extends Command>(
    commandCtor: CommandCtor<TCommand>,
    handlerCtor: CommandHandlerCtor<TCommand>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: CommandReceiverOptions,
  ): AsyncOrSync<Disposable> {
    const entry = this.ensureMapEntry(commandCtor);

    entry.push(handlerCtor);

    return new TestCommandReceiverDispose(() => {
      const index = entry.indexOf(handlerCtor);
      if (index !== -1) {
        entry.splice(index, 1);
      }
    });
  }

  private ensureMapEntry(commandCtor: CommandCtor) {
    let entry = this._map.get(commandCtor);

    if (!entry) {
      entry = [];
      this._map.set(commandCtor, entry);
    }

    return entry;
  }
}

export class TestCommandReceiverDispose implements Disposable {
  private readonly _disposeFunction: () => void;

  constructor(disposeFunction: () => void) {
    this._disposeFunction = disposeFunction;
  }

  public dispose(): void {
    this._disposeFunction();
  }
}
