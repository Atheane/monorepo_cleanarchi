import { defaultLogger } from '@oney/logger-adapters';
import {
  Event,
  EventCtor,
  EventHandler,
  EventMetadata,
  EventReceiver,
  SubscriptionInfo,
} from '@oney/messages-core';
import { injectable } from 'inversify';

@injectable()
export class TestEventReceiver extends EventReceiver {
  private _map: Map<EventCtor, EventHandler[]>;

  constructor() {
    super();
    this._map = new Map<EventCtor, EventHandler[]>();
  }

  public async inject(event: Event) {
    const metadata = EventMetadata.getFromInstance(event);
    const handlers = this.ensureMapEntry(metadata.target);
    for (const handler of handlers) {
      defaultLogger.info(`EventHandler ${handler.constructor.name} executing`);
      await handler.handle(event, {});
      defaultLogger.info(`EventHandler ${handler.constructor.name} executed`);
    }
  }

  public async subscribe<T extends Event>(
    info: SubscriptionInfo,
    eventDomainHandler: EventHandler<T>,
  ): Promise<void> {
    const entry = this.ensureMapEntry(info.event);
    entry.push(eventDomainHandler);
  }

  private ensureMapEntry(event: EventCtor) {
    let entry = this._map.get(event);

    if (!entry) {
      entry = [];
      this._map.set(event, entry);
    }

    return entry;
  }
}
