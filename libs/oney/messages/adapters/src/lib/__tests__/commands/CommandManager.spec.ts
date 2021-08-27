import 'reflect-metadata';
import { Disposable } from '@oney/core';
import {
  Command,
  CommandCtor,
  CommandHandlerCtor,
  CommandHandlerRegistry,
  CommandReceiver,
  CommandReceiverOptions,
} from '@oney/messages-core';
import { DefaultQueueProviderFromCommand } from '../../commands/DefaultQueueProviderFromCommand';
import { CommandManager } from '../../commands/CommandManager';
import { DefaultCommandHandlerRegistry } from '../../commands/DefaultCommandHandlerRegistry';
import { SampleCommand } from '../__fixtures__/commands/SampleCommand';
import { SampleCommandHandler } from '../__fixtures__/commands/SampleCommandHandler';

describe('CommandManager', () => {
  let commandReceiver: CommandReceiverStub;
  let commandHandlerRegistry: CommandHandlerRegistry;
  let topicQueueProvider: DefaultQueueProviderFromCommand;
  let commandManager: CommandManager;

  class CommandReceiverStub implements CommandReceiver {
    public commandCtor: CommandCtor;
    public handlerCtor: CommandHandlerCtor;
    public options?: CommandReceiverOptions;

    public subscribe<TCommand extends Command>(
      commandCtor: CommandCtor<TCommand>,
      handlerCtor: CommandHandlerCtor<TCommand>,
      options?: CommandReceiverOptions,
    ): Disposable {
      this.commandCtor = commandCtor;
      this.handlerCtor = handlerCtor;
      this.options = options;

      return {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        dispose() {},
      };
    }
  }

  beforeEach(() => {
    commandReceiver = new CommandReceiverStub();
    commandHandlerRegistry = new DefaultCommandHandlerRegistry();
    topicQueueProvider = new DefaultQueueProviderFromCommand(commandHandlerRegistry);

    commandManager = new CommandManager(commandReceiver, commandHandlerRegistry, topicQueueProvider);
  });

  it('should work', async () => {
    commandManager.register(SampleCommand, SampleCommandHandler);

    await commandManager.start();

    expect(commandReceiver.commandCtor).toEqual(SampleCommand);
    expect(commandReceiver.handlerCtor).toEqual(SampleCommandHandler);
    expect(commandReceiver.options).toEqual({});
  });
});
