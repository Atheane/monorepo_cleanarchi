import { EventDispatcher, Event, EventProducerDispatcher, EventProducer } from '@oney/messages-core';

export class EventDispatcherStub extends EventDispatcher {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  doDispatch(events: Event[]): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export class EventProducerDispatcherStub implements EventProducerDispatcher {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public dispatch(producer: EventProducer): Promise<void> {
    return Promise.resolve(undefined);
  }
}
