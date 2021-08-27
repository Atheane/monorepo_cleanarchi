import { Event, EventDispatcher } from '@oney/messages-core';

export class EventDispatcherStub extends EventDispatcher {
  events: Event[] = [];

  clear() {
    this.events = [];
  }

  async doDispatch(events: Event[]): Promise<void> {
    this.events = events;
  }
}
