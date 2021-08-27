import { OneySymbol, Queue } from '@oney/core';
import { Command } from './Command';

export const SymQueueProviderFromCommandInstance = OneySymbol('QueueProviderFromCommandInstance');

export interface QueueProviderFromCommandInstance {
  getQueue<TCommand extends Command>(command: TCommand): Promise<Queue>;
}
