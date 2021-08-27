import { Topic } from '@oney/core';
import { Event, EventHandlerRegistration, TopicProviderFromEventCtor } from '@oney/messages-core';
import { injectable } from 'inversify';

@injectable()
export class TopicProviderFromRegistration {
  private _topicProvider: TopicProviderFromEventCtor;

  constructor(topicProvider: TopicProviderFromEventCtor) {
    this._topicProvider = topicProvider;
  }

  getTopics<TEvent extends Event>(registration: EventHandlerRegistration<TEvent>): Topic[] {
    if (registration.options && registration.options.topic) {
      return [registration.options.topic];
    }

    return this._topicProvider.getTopics(registration.event);
  }
}
