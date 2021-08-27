import { Command, CommandHandler, CommandHandlerActivator, CommandHandlerCtor } from '@oney/messages-core';
import { Container } from 'inversify';

export class DefaultCommandHandlerActivator extends CommandHandlerActivator {
  private _container: Container;

  constructor(container: Container) {
    super();

    this._container = container;
  }

  public activate<TCommand extends Command>(handler: CommandHandlerCtor<TCommand>): CommandHandler<TCommand> {
    return this._container.resolve(handler);
  }
}
