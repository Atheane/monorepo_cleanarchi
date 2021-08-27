import { defaultLogger } from '@oney/logger-adapters';
import { EventDispatcher, EventErrors, EventProducer, EventProducerDispatcher } from '@oney/messages-core';
import { injectable } from 'inversify';

@injectable()
export class DefaultEventProducerDispatcher implements EventProducerDispatcher {
  private _dispatcher: EventDispatcher;

  constructor(dispatcher: EventDispatcher) {
    this._dispatcher = dispatcher;
  }

  public async dispatch(producer: EventProducer): Promise<void> {
    const events = producer.getEvents();

    defaultLogger.info(`Process ${events.length} events produced by: ${producer.constructor.name}`, {
      events: events.map(x => x.constructor.name),
    });

    if (events.length <= 0) {
      throw new EventErrors.DomainEventsMapEmpty('Please provide core event before dispatch');
    }

    await this._dispatcher.dispatch(...events);

    return producer.clearEvents();
  }
}
