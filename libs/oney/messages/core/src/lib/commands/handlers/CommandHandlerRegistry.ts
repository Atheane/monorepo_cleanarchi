import { AsyncOrSync } from 'ts-essentials';
import { CommandHandlerCtor } from './CommandHandlerCtor';
import { CommandHandlerRegistration } from './CommandHandlerRegistration';
import { CommandHandlerRegistrationOptions } from './CommandHandlerRegistrationOptions';
import { Command } from '../Command';
import { CommandCtor } from '../CommandCtor';

export abstract class CommandHandlerRegistry {
  abstract register<TCommand extends Command>(
    command: CommandCtor<TCommand>,
    handler: CommandHandlerCtor<TCommand>,
    options?: CommandHandlerRegistrationOptions,
  ): AsyncOrSync<void>;

  abstract read(): AsyncOrSync<CommandHandlerRegistration[]>;
}
