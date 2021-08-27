/* eslint-disable */
import 'reflect-metadata';
import { ServiceBusClient } from '@azure/service-bus';
import { expect, jest } from '@jest/globals';
import { configureInMemoryEventHandlerExecution } from '@oney/az-servicebus-adapters';
import { AggregateRoot, buildDomainEventDependencies, DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent, EventDispatcher, EventHandlerExecutionFinder, EventHandlerExecutionStore, EventMessageBody, EventMessageBodySerializer, EventMetadata, EventProducerDispatcher, EventReceiver } from '@oney/messages-core';
import { Container } from 'inversify';
import { connection } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { defaultLogger } from '../../../../../oney/logger/adapters/src/lib/default';
import { createAzureConnection } from '../build';

jest.mock('@azure/service-bus', () => {
  return {
    ReceiveMode: {
      peekLock: 1,
      receiveAndDelete: 2,
    },
    ServiceBusClient: {
      createFromConnectionString: jest.fn().mockReturnValue({
        name: 'AzureBus',
        createTopicClient: jest.fn().mockReturnValue({
          createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
          }),
        }),
        createSubscriptionClient: jest.fn().mockReturnValue({
          addRule: jest.fn(),
          createReceiver: jest.fn().mockReturnValue({
            registerMessageHandler: jest.fn(),
            receiveMessages: jest.fn().mockReturnValue([
              {
                body: JSON.stringify({
                  eventName: 'ORDER_CREATED',
                }),
                complete: jest.fn(),
              },
              {
                body: JSON.stringify({
                  eventName: 'ORDER_UPDATED',
                }),
                complete: jest.fn(),
              },
            ]),
          }),
        }),
      }),
    },
  };
});

@DecoratedEvent({ version: 1, name: 'ORDER_REFUSED', namespace: '@oney/test' })
class OrderRefused implements DomainEvent<OrderProps> {
  id = uuidv4();
  props: OrderProps;
  metadata: DomainEventMetadata;

  constructor(orderCreated: OrderProps) {
    this.props = { ...orderCreated };
  }
}

interface OrderProps {
  id: string;
  name: string;
}

class Order extends AggregateRoot<OrderProps> {
  public readonly props: OrderProps;

  constructor(order: OrderProps) {
    super(order.id);
    Object.assign(this, order);
  }
}

const container = new Container();

describe('Azure service bus tests', () => {
  let _subManager: EventProducerDispatcher;
  let _subDispatcher: EventDispatcher;
  let _subReceiver: EventReceiver;
  let mockBusSend: jest.Mock;

  beforeAll(() => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    configureInMemoryEventHandlerExecution(container);
    buildDomainEventDependencies(container).usePlugin(
      createAzureConnection(
        'aze',
        'azopek',
        'poazke',
        defaultLogger,
        container.get(EventHandlerExecutionFinder),
        container.get(EventHandlerExecutionStore),
      )
    );
    _subManager = container.get(EventProducerDispatcher);
    _subDispatcher = container.get(EventDispatcher);
    _subReceiver = container.get(EventReceiver);
  });

  it('Should add core event', async () => {
    const order = new Order({
      id: 'azpem',
      name: 'zoaekzaoek',
    });

    const orderCreated = new OrderRefused({
      name: 'ap^zel',
      id: 'azpem',
    });

    order.addDomainEvent(orderCreated);
    const dispatcher = _subManager.dispatch(order);
    await expect(dispatcher).resolves.not.toThrow();
  });

  it('Should use custom serializer', async () => {
    const orderRefused = new OrderRefused({
      name: 'ap^zel',
      id: 'azpem',
    });

    const now = new Date();

    class CustomSerializer extends EventMessageBodySerializer {
      public deserialize(messageBody: string | Buffer): EventMessageBody {
        return {
          domainEventProps: {
            id: '3712',
            sentAt: now.toISOString(),
            timestamp: now.getTime(),
            metadata: {
              eventName: '3712',
              namespace: '3712',
              version: 3712
            }
          },
        };
      }

      public serialize(messageBody: EventMessageBody): string | Buffer {
        return '3712';
      }
    }

    const dispatcher = _subDispatcher.dispatch(orderRefused).configure({
      customSerializer: new CustomSerializer(),
    });

    await expect(dispatcher).resolves.not.toThrow();

    expect(mockBusSend).toHaveBeenCalledWith(expect.objectContaining({ body: '3712'}));
  });

  it('Should print metadatas eventName and version', async () => {
    @DecoratedEvent({ name: 'ORDER_CREATED', version: 1, namespace: '@oney/test' })
    class OrderCreated implements DomainEvent<OrderProps> {
      id: string;
      props: OrderProps;
      metadata: DomainEventMetadata;
    }

    const instance = new OrderCreated();

    const metadata = EventMetadata.getFromInstance(instance);

    expect(metadata.name).toEqual('ORDER_CREATED');
    expect(metadata.version).toEqual(1);
  });

  // it('Should throw error cause missing event decorator', async () => {
  //   class OrderCreated implements DomainEvent {
  //     id: string;
  //     props: OrderProps;
  //     metadata: DomainEventMetadata;
  //   }
  //
  //   class OrderCreatedEventHandler extends DomainEventHandler<OrderCreated> {
  //     async handle(domainEvent: OrderCreated): Promise<void> {
  //       return Promise.resolve(undefined);
  //     }
  //   }
  //
  //   const result = new OrderCreatedEventHandler();
  //   await expect(result).rejects.toThrow(EventErrors.MissingEventAttributes);
  // });

  // it('Should resolve subscription', async () => {
  //   @DecoratedEvent({ name: 'ORDER_CREATED', version: 1 })
  //   class OrderCreated implements DomainEvent<OrderProps> {
  //     id: string;
  //     props: OrderProps;
  //     metadata
  //   }
  //
  //   @injectable()
  //   class OrderCreatedEventHandler extends DomainEventHandler<OrderCreated> {
  //     async handle(domainEvent: DomainEvent): Promise<void> {
  //       return console.log(domainEvent);
  //     }
  //   }
  //
  //   const result = new OrderCreatedEventHandler();
  //   await expect(result).resolves.not.toThrow();
  // });
});
