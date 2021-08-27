import { EventCtor, EventHandlerRegistrationOptions } from '@oney/messages-core';
import { EventHandlerCtor } from './EventHandlerCtor';
import { Event } from '../Event';

export interface EventHandlerRegistration<TEvent extends Event = Event> {
  event: EventCtor<TEvent>;
  handler: EventHandlerCtor<TEvent>;
  options?: EventHandlerRegistrationOptions;
}
