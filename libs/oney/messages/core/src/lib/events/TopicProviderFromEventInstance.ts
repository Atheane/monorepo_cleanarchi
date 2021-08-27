import { OneySymbol, Topic } from '@oney/core';
import { Event } from './Event';

export const SymTopicProviderFromEventInstance = OneySymbol('TopicProviderFromEventInstance');

export interface TopicProviderFromEventInstance {
  getTopics<TEvent extends Event>(event: TEvent): Topic[];
}
