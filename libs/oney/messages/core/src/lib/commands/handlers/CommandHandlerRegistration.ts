import { CommandHandlerCtor } from './CommandHandlerCtor';
import { CommandHandlerRegistrationOptions } from './CommandHandlerRegistrationOptions';
import { Command } from '../Command';
import { CommandCtor } from '../CommandCtor';

export interface CommandHandlerRegistration<TCommand extends Command = Command> {
  command: CommandCtor<TCommand>;
  handler: CommandHandlerCtor<TCommand>;
  options: CommandHandlerRegistrationOptions;
}
