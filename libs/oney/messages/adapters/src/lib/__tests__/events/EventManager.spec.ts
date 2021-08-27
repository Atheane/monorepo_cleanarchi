import 'reflect-metadata';
import { EventManager, DefaultEventHandlerRegistry } from '@oney/messages-adapters';
import {
  EventHandler,
  EventHandlerRegistry,
  DecoratedEvent,
  EventReceiver,
  SubscriptionInfo,
  Event,
} from '@oney/messages-core';
import { Container, injectable } from 'inversify';
import { DefaultTopicProviderFromEvent } from '../../events/DefaultTopicProviderFromEvent';
import { TopicProviderFromRegistration } from '../../events/TopicProviderFromRegistration';

describe('EventManager', () => {
  let container: Container;
  let eventReceiver: EventReceiverStub;
  let eventHandlerRegistry: EventHandlerRegistry;
  let topicProviderFromRegistration: TopicProviderFromRegistration;
  let eventManager: EventManager;

  class EventReceiverStub implements EventReceiver {
    public info: SubscriptionInfo;
    public eventDomainHandler: EventHandler<Event>;

    public subscribe<T extends Event>(
      info: SubscriptionInfo,
      eventDomainHandler: EventHandler<T>,
    ): Promise<void> {
      this.info = info;
      this.eventDomainHandler = eventDomainHandler;

      return Promise.resolve();
    }
  }

  beforeEach(() => {
    container = new Container();
    eventReceiver = new EventReceiverStub();
    eventHandlerRegistry = new DefaultEventHandlerRegistry();
    const topicProviderFromEvent = new DefaultTopicProviderFromEvent();
    topicProviderFromRegistration = new TopicProviderFromRegistration(topicProviderFromEvent);

    eventManager = new EventManager(
      container,
      eventReceiver,
      eventHandlerRegistry,
      topicProviderFromRegistration,
    );
  });

  it('should work', async () => {
    @DecoratedEvent({ namespace: '@oney/test', name: 'TestEvent', version: 0 })
    class TestEvent implements Event<any> {
      public id: string;
      public props: any;
    }

    @injectable()
    class TestEventHandler implements EventHandler<TestEvent> {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public handle(domainEvent: TestEvent): Promise<void> {
        return Promise.resolve();
      }
    }

    eventManager.register(TestEvent, TestEventHandler);

    await eventManager.start();

    expect(eventReceiver.info).toEqual({
      topic: '@oney/test',
      event: TestEvent,
    });
  });
});
