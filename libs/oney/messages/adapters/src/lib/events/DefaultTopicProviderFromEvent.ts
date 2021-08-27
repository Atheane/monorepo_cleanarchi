import { Topic } from '@oney/core';
import {
  EventCtor,
  TopicProviderFromEventCtor,
  TopicProviderFromEventInstance,
  Event,
  EventMetadata,
} from '@oney/messages-core';
import { injectable } from 'inversify';
import { assert } from 'ts-essentials';

@injectable()
export class DefaultTopicProviderFromEvent
  implements TopicProviderFromEventInstance, TopicProviderFromEventCtor {
  getTopics<TEvent extends Event>(event: TEvent): Topic[];
  getTopics<TEvent extends Event>(event: EventCtor<TEvent>): Topic[];
  getTopics<TEvent extends Event>(event: TEvent | EventCtor<TEvent>): Topic[] {
    let metadata: EventMetadata<TEvent>;
    if (event instanceof Function) {
      metadata = EventMetadata.getFromCtor(event);
    } else {
      metadata = EventMetadata.getFromInstance(event);
    }

    assert(metadata.namespace);

    return [metadata.namespace];
  }
}
