import { EventReceiveContext, Event } from '@oney/messages-core';
import { AsyncOrSync } from 'ts-essentials';

export interface EventHandler<TEvent extends Event = Event> {
  handle: (event: TEvent, ctx: EventReceiveContext) => AsyncOrSync<void>;
}
