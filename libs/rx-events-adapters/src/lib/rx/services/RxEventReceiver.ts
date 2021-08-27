import { defaultLogger } from '@oney/logger-adapters';
import { DefaultEventMessageBodyMapper, DefaultEventMessageBodySerializer } from '@oney/messages-adapters';
import {
  Event,
  EventHandler,
  EventMetadata,
  EventReceiver,
  StaticEventRegistry,
  SubscriptionInfo,
} from '@oney/messages-core';
import { injectable } from 'inversify';
import { merge, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { RxServiceBus } from './RxServiceBus';
import { RxEventType } from './types/RxEventType';

@injectable()
export class RxEventReceiver implements EventReceiver {
  private _rxServiceBus: RxServiceBus;
  private _defaultMapper: DefaultEventMessageBodyMapper;
  private _defaultSerializer: DefaultEventMessageBodySerializer;

  constructor(rxServiceBus: RxServiceBus) {
    this._rxServiceBus = rxServiceBus;
    this._defaultMapper = new DefaultEventMessageBodyMapper();
    this._defaultSerializer = new DefaultEventMessageBodySerializer();
  }

  obs$: Observable<any>[] = [];
  subscription: Subscription;
  merge: Observable<any>;

  async subscribe<T extends Event>(info: SubscriptionInfo, eventHandler: EventHandler<T>): Promise<void> {
    const mapper = info.customMapper ?? this._defaultMapper;
    const serializer = info.customSerializer ?? this._defaultSerializer;

    defaultLogger.info(`EventHandler ${eventHandler.constructor.name} registering`);

    const metadata = EventMetadata.getOrThrowFromCtor(info.event);

    const obs = this._rxServiceBus.bus$.pipe(
      filter(e => e.metadata.namespace == null || e.metadata.namespace === metadata.namespace),
      filter(e => e.metadata.name === metadata.name),
      filter(e => e.metadata.version === metadata.version),
      map(message => {
        const messageBody = serializer.deserialize(message.body);
        return mapper.toEvent(messageBody);
      }),
      map(async receivedEvent => {
        defaultLogger.info(`EventHandler ${eventHandler.constructor.name} executing`);

        const event = this.tryToGetRealInstance(receivedEvent as RxEventType);
        await eventHandler.handle(event, {});

        console.info(`EventHandler ${eventHandler.constructor.name} executed`);
      }),
    );

    this.obs$.push(obs);

    this.merge = merge(...this.obs$);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.merge.subscribe();

    defaultLogger.info(`EventHandler ${eventHandler.constructor.name} registered`);
  }

  waitEvents(count: number): Promise<any> {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const promise = this.merge.pipe(take(count)).toPromise();

    promise.finally(() => {
      this.merge = merge(...this.obs$);

      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.merge.subscribe();
    });

    return promise;
  }

  private tryToGetRealInstance(eventMessage: RxEventType) {
    const metadata = eventMessage.metadata;
    const entry = StaticEventRegistry.get(metadata.namespace, metadata.eventName, metadata.version);

    let event: any = {};
    if (entry) {
      event = new entry.target();
    } else {
      defaultLogger.warn(`Event constructor not found for: ${metadata.eventName}`, { metadata });
    }

    Object.assign(event, eventMessage);

    return event;
  }
}
