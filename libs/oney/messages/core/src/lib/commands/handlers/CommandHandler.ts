import { AsyncOrSync } from 'ts-essentials';
import { Command } from '../Command';
import { CommandReceiveContext } from '../CommandReceiveContext';

export interface CommandHandler<TCommand extends Command = Command> {
  handle: (command: TCommand, ctx: CommandReceiveContext) => AsyncOrSync<void>;
}
