import { Topic } from '@oney/core';
import { EventCtor, TopicProviderFromEventCtor } from '@oney/messages-core';
import { SagaRegistryEntry, SagaState, SagaTopicProvider } from '@oney/saga-core';

export class DefaultSagaTopicProvider implements SagaTopicProvider {
  private _topicProvider: TopicProviderFromEventCtor;

  constructor(topicProvider: TopicProviderFromEventCtor) {
    this._topicProvider = topicProvider;
  }

  public getTopics(event: EventCtor, entry: SagaRegistryEntry<SagaState>): Topic[] {
    const topicMap = entry.options?.eventTopicMap;

    if (topicMap && topicMap.has(event)) {
      return [topicMap.get(event)];
    } else {
      return this._topicProvider.getTopics(event);
    }
  }
}
