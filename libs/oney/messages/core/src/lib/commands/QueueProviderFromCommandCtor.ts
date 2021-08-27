import { OneySymbol, Queue } from '@oney/core';
import { Command } from './Command';
import { CommandCtor } from './CommandCtor';

export const SymQueueProviderFromCommandCtor = OneySymbol('QueueProviderFromCommandCtor');

export interface QueueProviderFromCommandCtor {
  getQueue<TCommand extends Command>(command: CommandCtor<TCommand>): Promise<Queue>;
}
