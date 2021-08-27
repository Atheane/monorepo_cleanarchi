import { JSONConvert } from '@oney/common-core';
import { DefaultEventMessageBodyMapper, DefaultEventMessageBodySerializer } from '@oney/messages-adapters';
import {
  Event,
  EventDispatcher,
  EventHandler,
  EventMetadata,
  EventReceiver,
  StaticEventRegistry,
  SubscriptionInfo,
} from '@oney/messages-core';
import { RxEventDispatcher, RxEventReceiver, RxServiceBus } from '@oney/rx-events-adapters';
import { v4 } from 'uuid';
import { SampleEvent } from './__fixtures__/SampleEvent';
import { RxMessageBody } from '../services/types/RxMessageBody';

class EventDispatcherWrap extends EventDispatcher {
  private _defaultMapper: DefaultEventMessageBodyMapper;
  private _defaultSerializer: DefaultEventMessageBodySerializer;

  constructor(private readonly receiver: EventReceiverWrap) {
    super();
    this._defaultMapper = new DefaultEventMessageBodyMapper();
    this._defaultSerializer = new DefaultEventMessageBodySerializer();
  }

  async doDispatch(events: Event[]): Promise<void> {
    for (const event of events) {
      const metadata = EventMetadata.getOrThrowFromInstance(event);
      const eventMessageBody = this._defaultMapper.toEventMessageBody(event);
      const serializedBody = this._defaultSerializer.serialize(eventMessageBody);

      const message = {
        body: serializedBody,
        // We put the event for differenciate from other domainEvent as the id can be the same.
        messageId: event.id,
        partitionKey: v4(),
        label: metadata.name,
        userProperties: {
          version: metadata.version,
        },
      };

      await this.receiver.inject(message);
    }
  }
}

class EventReceiverWrap extends EventReceiver {
  constructor(
    private readonly rxDispatcher: RxEventDispatcher,
    private readonly rxReceiver: RxEventReceiver,
  ) {
    super();
  }

  public inject(message: any) {
    const eventMessage = JSONConvert.deserialize(message.body) as RxMessageBody;

    const event = {
      id: eventMessage.id,
      props: eventMessage,
      metadata: eventMessage.domainEventProps.metadata,
      timestamp: eventMessage.domainEventProps.timestamp,
      sentAt: new Date(eventMessage.domainEventProps.timestamp), // for legacy compatibility
    };

    const realEvent = this.tryToGetRealInstance(event);
    return this.rxDispatcher.dispatch(realEvent);
  }

  public subscribe<T extends Event>(
    info: SubscriptionInfo,
    eventDomainHandler: EventHandler<T>,
  ): Promise<void> {
    return this.rxReceiver.subscribe(info, eventDomainHandler);
  }

  private tryToGetRealInstance(eventMessage: any) {
    const metadata = eventMessage.metadata;
    const entry = StaticEventRegistry.get(metadata.namespace, metadata.eventName, metadata.version);

    let event: any = {};
    if (entry) {
      event = new entry.target();
    }

    Object.assign(event, eventMessage);

    return event;
  }
}

describe('MultiLayerDispatch', () => {
  let rxServiceBus: RxServiceBus;
  let rxReceiver: RxEventReceiver;
  let rxDispatcher: RxEventDispatcher;
  let receiverWrap: EventReceiverWrap;
  let dispatcherWrap: EventDispatcherWrap;

  beforeEach(() => {
    rxServiceBus = new RxServiceBus();
    rxReceiver = new RxEventReceiver(rxServiceBus);
    rxDispatcher = new RxEventDispatcher(rxServiceBus);

    receiverWrap = new EventReceiverWrap(rxDispatcher, rxReceiver);
    dispatcherWrap = new EventDispatcherWrap(receiverWrap);
  });

  it('should receive an event from wrapper', async () => {
    let eventReceived: any = undefined;

    await receiverWrap.subscribe(
      {
        topic: '',
        event: SampleEvent,
      },
      {
        handle: e => {
          console.log('RECEIVED EVENT', e);
          eventReceived = e;
        },
      },
    );

    const event = new SampleEvent();

    event.props = { something: '3712' };

    await dispatcherWrap.dispatch(event);

    expect(eventReceived).toBeDefined();
    expect(eventReceived).toMatchObject({ props: event.props });
  });

  it('should receive an event from wrapper one time by handler', async () => {
    let handler1Called = 0;
    let handler2Called = 0;

    await receiverWrap.subscribe(
      {
        topic: '',
        event: SampleEvent,
      },
      {
        handle: () => {
          handler1Called++;
        },
      },
    );

    await receiverWrap.subscribe(
      {
        topic: '',
        event: SampleEvent,
      },
      {
        handle: () => {
          handler2Called++;
        },
      },
    );

    const event = new SampleEvent();

    event.props = { something: '3712' };

    await dispatcherWrap.dispatch(event);

    expect(handler1Called).toBe(1);
    expect(handler2Called).toBe(1);
  });
});
