import { OneySymbol, Topic } from '@oney/core';
import { Event } from './Event';
import { EventCtor } from './EventCtor';

export const SymTopicProviderFromEventCtor = OneySymbol('TopicProviderFromEventCtor');

export interface TopicProviderFromEventCtor {
  getTopics<TEvent extends Event>(event: EventCtor<TEvent>): Topic[];
}
