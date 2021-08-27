import { Newable } from 'ts-essentials';
import { CommandHandler } from './CommandHandler';
import { Command } from '../Command';

export type CommandHandlerCtor<TCommand extends Command = Command> = Newable<CommandHandler<TCommand>>;
