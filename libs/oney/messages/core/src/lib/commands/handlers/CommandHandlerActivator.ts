import { CommandHandler } from './CommandHandler';
import { CommandHandlerCtor } from './CommandHandlerCtor';
import { Command } from '../Command';

export abstract class CommandHandlerActivator {
  abstract activate<TCommand extends Command>(
    handler: CommandHandlerCtor<TCommand>,
  ): CommandHandler<TCommand>;
}
