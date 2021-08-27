import { DecoratedEvent, Event } from '@oney/messages-core';

@DecoratedEvent({ name: 'EventWithoutNamespace', version: 0 })
export class EventWithoutNamespace implements Event {
  id: string;
  timestamp?: number;
  props: any;
}
