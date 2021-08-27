import { EventHandler, EventReceiveContext } from '@oney/messages-core';
import { AsyncOrSync } from 'ts-essentials';
import { SampleEvent } from './SampleEvent';

export class SampleEventHandler implements EventHandler<SampleEvent> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handle(event: SampleEvent, ctx: EventReceiveContext): AsyncOrSync<void> {
    return;
  }
}
