import { EventDispatcher, EventReceiver } from '@oney/messages-core';

export type EventsManager = {
  eventDispatcher: EventDispatcher;
  eventReceiver: EventReceiver;
};
