import { DecoratedEvent, Event } from '@oney/messages-core';

@DecoratedEvent({ name: 'SAMPLE_EVENT', version: 0, namespace: '@oney/test' })
export class SampleEvent implements Event {
  public id: string;
  public props: any;
}
