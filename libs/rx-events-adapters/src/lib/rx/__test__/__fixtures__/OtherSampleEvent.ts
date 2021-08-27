import { DecoratedEvent, Event } from '@oney/messages-core';

@DecoratedEvent({ name: 'OtherSampleEvent', namespace: '@oney/test', version: 0 })
export class OtherSampleEvent implements Event {
  id: string;
  timestamp?: number;
  props: any;
}
