import { DecoratedEvent, Event } from '@oney/messages-core';

@DecoratedEvent({ name: 'SampleEvent', namespace: '@oney/test', version: 0 })
export class SampleEvent implements Event {
  id: string;
  timestamp?: number;
  props: any;
}
