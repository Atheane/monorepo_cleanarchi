import 'reflect-metadata';
import { ReceivedMessageInfo } from '@azure/service-bus';
import { DefaultEventHandlerExecutionFinder } from '@oney/az-servicebus-adapters';
import { DefaultEventMessageBodyMapper, DefaultEventMessageBodySerializer } from '@oney/messages-adapters';
import {
  DecoratedEvent,
  Event,
  EventHandler,
  EventHandlerExecutionStatus,
  EventHandlerSubscription,
  EventMetadata,
  EventReceiveContext,
} from '@oney/messages-core';
import { MongooseScope, MongoScope } from '@oney/saga-adapters';
import { SetupMongoMemory } from '@oney/test';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { v4 } from 'uuid';
import { DefaultEventHandlerExecutionStore } from '../services/execution/DefaultEventHandlerExecutionStore';
import { IdempotentEventHandlerExecutionStrategy } from '../services/execution/IdempotentEventHandlerExecutionStrategy';
import { EventHandlerExecution } from '../services/execution/EventHandlerExecution';
import { MongoEventHandlerExecutionRepository } from '../services/execution/mongo/MongoEventHandlerExecutionRepository';
import { connectEventHandlerExecutionModel } from '../services/execution/mongo/schemas/EventHandlerExecutionSchema';

@DecoratedEvent({ name: 'EventHandlerExecutionEvent', namespace: '@oney/test', version: 0 })
class EventHandlerExecutionEvent implements Event {
  constructor(id: string) {
    this.id = id;
  }

  public id: string;
  public props: object;
}

class EventHandlerExecutionEventHandler implements EventHandler<EventHandlerExecutionEvent> {
  constructor(private shouldFail: () => boolean) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handle(event: EventHandlerExecutionEvent, ctx: EventReceiveContext): void {
    const shouldFail = this.shouldFail();
    if (shouldFail) {
      throw new Error();
    }
  }
}

describe('EventHandlerExecution', () => {
  SetupMongoMemory();

  const ScopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  let model;
  let repository: MongoEventHandlerExecutionRepository;
  let finder: DefaultEventHandlerExecutionFinder;
  let store: DefaultEventHandlerExecutionStore;
  let mapper: DefaultEventMessageBodyMapper;
  let serializer: DefaultEventMessageBodySerializer;

  function initializeServices(connection: Connection) {
    model = connectEventHandlerExecutionModel(connection);
    repository = new MongoEventHandlerExecutionRepository(model);
    finder = new DefaultEventHandlerExecutionFinder(repository);
    store = new DefaultEventHandlerExecutionStore(repository);
    mapper = new DefaultEventMessageBodyMapper();
    serializer = new DefaultEventMessageBodySerializer();
  }

  let spyOn_lastHandle;
  function generateSubscription(shouldFail: () => boolean) {
    const metadata = EventMetadata.getFromCtor(EventHandlerExecutionEvent);
    const handler = new EventHandlerExecutionEventHandler(shouldFail);

    spyOn_lastHandle = jest.spyOn(handler, 'handle');

    const subscription: EventHandlerSubscription = {
      topic: 'topic',
      subscription: 'subscription',
      eventMetadata: metadata,
      handler: handler,
      handlerUniqueIdentifier: handler.constructor.name,
      mapper: mapper,
      serializer: serializer,
      executionStrategy: new IdempotentEventHandlerExecutionStrategy(finder),
    };

    return subscription;
  }

  function generateMessage(id = v4()) {
    const metadata = EventMetadata.getFromCtor(EventHandlerExecutionEvent);
    const event = new EventHandlerExecutionEvent(id);
    const messageBody = mapper.toEventMessageBody(event);
    const serializedBody = serializer.serialize(messageBody);
    return ({
      body: serializedBody,
      messageId: event.id,
      partitionKey: v4(),
      label: metadata.name,
      userProperties: {
        namespace: metadata.namespace,
        name: metadata.name,
        version: metadata.version,
      },
    } as unknown) as ReceivedMessageInfo;
  }

  it('should works with a success execution path', async () => {
    await ScopeFactory(async connection => {
      initializeServices(connection);

      const shouldFail = false;

      const subscription = generateSubscription(() => shouldFail);
      const message = generateMessage();
      const execution = new EventHandlerExecution(subscription, store);

      const result = await execution.execute(message);

      expect(spyOn_lastHandle).toBeCalledTimes(1);
      expect(result.completed).toBe(true);

      const entry = await finder.find(message.messageId.toString(), EventHandlerExecutionEventHandler.name);

      expect(entry).toBeDefined();
      expect(entry.completedAt).toBeDefined();
      expect(entry.history.length).toBe(1);

      const [historyEntry] = entry.history;

      expect(historyEntry.execution.endsAt).toBeDefined();
      expect(historyEntry.execution.status).toBe(EventHandlerExecutionStatus.COMPLETED);
    });
  });

  it('should works with a fail execution path', async () => {
    await ScopeFactory(async connection => {
      initializeServices(connection);

      const shouldFail = true;

      const subscription = generateSubscription(() => shouldFail);
      const message = generateMessage();
      const execution = new EventHandlerExecution(subscription, store);

      const result = await execution.execute(message);

      expect(spyOn_lastHandle).toBeCalledTimes(1);
      expect(result.completed).toBe(false);

      const entry = await finder.find(message.messageId.toString(), EventHandlerExecutionEventHandler.name);

      expect(entry).toBeDefined();
      expect(entry.completedAt).toBeUndefined();
      expect(entry.history.length).toBe(1);

      const [historyEntry] = entry.history;

      expect(historyEntry.execution.endsAt).toBeDefined();
      expect(historyEntry.execution.status).toBe(EventHandlerExecutionStatus.FAILED);
    });
  });

  it('should works with a multiple execution path', async () => {
    await ScopeFactory(async connection => {
      initializeServices(connection);

      let shouldFail = true;

      const subscription = generateSubscription(() => shouldFail);
      const message = generateMessage();

      const repeat = async () => {
        const execution = new EventHandlerExecution(subscription, store);
        const result = await execution.execute(message);

        expect(result.completed).toBe(!shouldFail);
      };

      await repeat();

      expect(spyOn_lastHandle).toBeCalledTimes(1);
      let entry = await finder.find(message.messageId.toString(), EventHandlerExecutionEventHandler.name);
      expect(entry.history.length).toBe(1);

      await repeat();

      expect(spyOn_lastHandle).toBeCalledTimes(2);
      entry = await finder.find(message.messageId.toString(), EventHandlerExecutionEventHandler.name);
      expect(entry.history.length).toBe(2);

      shouldFail = false;

      await repeat();

      expect(spyOn_lastHandle).toBeCalledTimes(3);
      entry = await finder.find(message.messageId.toString(), EventHandlerExecutionEventHandler.name);
      expect(entry.history.length).toBe(3);
    });
  });

  it('should not be reexecuted after success', async () => {
    await ScopeFactory(async connection => {
      initializeServices(connection);

      let shouldFail = true;

      const subscription = generateSubscription(() => shouldFail);
      const message = generateMessage();

      const repeat = async () => {
        const execution = new EventHandlerExecution(subscription, store);
        const result = await execution.execute(message);

        expect(result.completed).toBe(!shouldFail);
      };

      await repeat();

      expect(spyOn_lastHandle).toBeCalledTimes(1);
      let entry = await finder.find(message.messageId.toString(), EventHandlerExecutionEventHandler.name);
      expect(entry.history.length).toBe(1);

      shouldFail = false;

      await repeat();

      expect(spyOn_lastHandle).toBeCalledTimes(2);
      entry = await finder.find(message.messageId.toString(), EventHandlerExecutionEventHandler.name);
      expect(entry.history.length).toBe(2);

      await repeat();

      expect(spyOn_lastHandle).toBeCalledTimes(2);
      entry = await finder.find(message.messageId.toString(), EventHandlerExecutionEventHandler.name);
      expect(entry.history.length).toBe(2);
    });
  });
});
