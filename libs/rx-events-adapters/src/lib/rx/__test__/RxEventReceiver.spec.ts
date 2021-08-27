import {
  EventCtor,
  EventMetadata,
  Event,
  SubscriptionInfo,
  EventMessageBodySerializer,
  EventMessageBody,
} from '@oney/messages-core';
import { RxEventDispatcher, RxEventReceiver, RxServiceBus } from '@oney/rx-events-adapters';
import { EventWithoutNamespace } from './__fixtures__/EventWithoutNamespace';
import { OtherSampleEvent } from './__fixtures__/OtherSampleEvent';
import { SampleEvent } from './__fixtures__/SampleEvent';

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe('RxEventReceiver', () => {
  let rxServiceBus: RxServiceBus;
  let rxReceiver: RxEventReceiver;
  let rxDispatcher: RxEventDispatcher;

  beforeEach(() => {
    rxServiceBus = new RxServiceBus();
    rxReceiver = new RxEventReceiver(rxServiceBus);
    rxDispatcher = new RxEventDispatcher(rxServiceBus);
  });

  async function generateAndSubscribeHandler(event: EventCtor, info?: Partial<SubscriptionInfo>) {
    const metadata = EventMetadata.getFromCtor(event);

    const result = jest.fn();
    await rxReceiver.subscribe(
      {
        topic: metadata.namespace,
        event: event,
        ...info,
      },
      {
        handle: result,
      },
    );

    return result;
  }

  it('should throw error when we dont have metadata on dispatch', async () => {
    class EventWithoutMetadata implements Event {
      public id: string;
      public props: any;
    }

    const event = new EventWithoutMetadata();
    const shouldThrow = () => rxDispatcher.dispatch(event);

    await expect(shouldThrow).rejects.toThrow();
  });

  it('should throw error when we dont have metadata on receive', async () => {
    class EventWithoutMetadata implements Event {
      public id: string;
      public props: any;
    }

    const shouldThrow = () =>
      rxReceiver.subscribe(
        {
          topic: '',
          event: EventWithoutMetadata,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          handle: () => {},
        },
      );

    await expect(shouldThrow).rejects.toThrow();
  });

  it('should work with one handler, one event without namespace', async () => {
    const spyOn = await generateAndSubscribeHandler(EventWithoutNamespace);

    const event = new EventWithoutNamespace();
    await rxDispatcher.dispatch(event);

    await sleep(100);

    expect(spyOn).toBeCalledTimes(1);
  });

  it('should work with one handler, one event', async () => {
    const spyOn = await generateAndSubscribeHandler(SampleEvent);

    const event = new SampleEvent();
    await rxDispatcher.dispatch(event);

    await sleep(100);

    expect(spyOn).toBeCalledTimes(1);
  });

  it('should work with two handler, one event', async () => {
    const spyOn1 = await generateAndSubscribeHandler(SampleEvent);
    const spyOn2 = await generateAndSubscribeHandler(SampleEvent);

    const event = new SampleEvent();
    await rxDispatcher.dispatch(event);

    await sleep(100);

    expect(spyOn1).toBeCalledTimes(1);
    expect(spyOn2).toBeCalledTimes(1);
  });

  it('should work with two handler, two event', async () => {
    const spyOn1 = await generateAndSubscribeHandler(SampleEvent);
    const spyOn2 = await generateAndSubscribeHandler(OtherSampleEvent);

    const event1 = new SampleEvent();
    await rxDispatcher.dispatch(event1);

    await sleep(100);

    expect(spyOn1).toBeCalledTimes(1);
    expect(spyOn2).toBeCalledTimes(0);

    const event2 = new OtherSampleEvent();
    await rxDispatcher.dispatch(event2);

    await sleep(100);

    expect(spyOn1).toBeCalledTimes(1);
    expect(spyOn2).toBeCalledTimes(1);
  });

  it('should be able to apply routing with any serializer', async () => {
    const now = new Date();

    class CustomSerializer extends EventMessageBodySerializer {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public deserialize(messageBody: string | Buffer): EventMessageBody {
        return {
          domainEventProps: {
            id: '3712',
            sentAt: now.toISOString(),
            timestamp: now.getTime(),
            metadata: {
              eventName: '3712',
              namespace: '3712',
              version: 3712,
            },
          },
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public serialize(messageBody: EventMessageBody): string | Buffer {
        return '3712';
      }
    }

    const spyOn1 = await generateAndSubscribeHandler(SampleEvent, {
      customSerializer: new CustomSerializer(),
    });

    const promise = rxReceiver.waitEvents(1);

    const event1 = new SampleEvent();
    await rxDispatcher.dispatch(event1).configure({
      customSerializer: new CustomSerializer(),
    });

    await promise;

    expect(spyOn1).toBeCalledTimes(1);
  });
});
