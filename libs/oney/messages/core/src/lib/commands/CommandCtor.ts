import { Newable } from 'ts-essentials';
import { Command } from './Command';

export type CommandCtor<TCommand extends Command = Command> = Newable<TCommand>;
