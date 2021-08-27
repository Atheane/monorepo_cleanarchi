import { OneySymbol, Topic } from '@oney/core';
import { EventCtor } from '@oney/messages-core';
import { SagaRegistryEntry, SagaState } from '@oney/saga-core';

export const SymSagaTopicProvider = OneySymbol('SymSagaTopicProvider');

export interface SagaTopicProvider {
  getTopics(event: EventCtor, entry: SagaRegistryEntry<SagaState>): Topic[];
}
