import { EventCtor, Event } from '@oney/messages-core';
import { AsyncOrSync } from 'ts-essentials';

export abstract class SagaSubscription {
  // todo rename
  abstract get events(): EventCtor<Event>[];

  abstract handle(event: Event): AsyncOrSync<void>;
}
