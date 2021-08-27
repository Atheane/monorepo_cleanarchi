/* eslint-disable */
import 'reflect-metadata';
import { AggregateRoot, buildDomainEventDependencies, DomainEvent, DomainEventHandler, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent, EventDispatcher, EventErrors, EventMetadata, EventProducerDispatcher, EventReceiver } from '@oney/messages-core';
import { Container, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { initRxMessagingPlugin } from '../build';

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
  let _eventDispatcher: EventDispatcher;
  let _subManager: EventProducerDispatcher;
  let _subReceiver: EventReceiver;

  beforeAll(() => {
    buildDomainEventDependencies(container).usePlugin(initRxMessagingPlugin());
    _eventDispatcher = container.get(EventDispatcher);
    _subManager = container.get(EventProducerDispatcher);
    _subReceiver = container.get(EventReceiver);
  });

  it('Should add core event', async () => {
    const order = new Order({
      id: 'azpem',
      name: 'zoaekzaoek',
    });

    const orderRefused = new OrderRefused({
      name: 'ap^zel',
      id: 'azpem',
    });

    order.addDomainEvent(orderRefused);
    const dispatcher = _subManager.dispatch(order);
    // Will be log in another test

    await expect(dispatcher).resolves.not.toThrow();
  });

  it('Should print metadatas eventName and version', async () => {
    @DecoratedEvent({ name: 'ORDER_CREATED', version: 1, namespace: '@oney/test' })
    class OrderCreated implements DomainEvent<OrderProps> {
      id: string;
      props: OrderProps;
      metadata;
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
  //     metadata
  //   }
  //
  //   class OrderCreatedEventHandler extends DomainEventHandler<OrderCreated> {
  //     async handle(domainEvent: OrderCreated): Promise<void> {
  //       return Promise.resolve(undefined);
  //     }
  //   }
  //
  //   const result = new OrderCreatedEventHandler();
  //
  //   await expect(result).rejects.toThrow(EventErrors.MissingEventAttributes);
  // });

  it('Should resolve subscription', async () => {
    @DecoratedEvent({ name: 'ORDER_CREATED', version: 1, namespace: '@oney/test' })
    class OrderCreated implements DomainEvent<OrderProps> {
      id: string;
      props: OrderProps;
      metadata;

      constructor(props: OrderProps) {
        this.props = props;
      }
    }

    @injectable()
    class OrderRefusedEventHandler extends DomainEventHandler<OrderRefused> {
      async handle(domainEvent: DomainEvent): Promise<void> {
        return console.log(domainEvent);
      }
    }

    @injectable()
    class OrderCreatedEventHandler extends DomainEventHandler<OrderCreated> {
      async handle(domainEvent: OrderCreated): Promise<void> {
        expect(domainEvent.id).toEqual('hello');
      }
    }

    const order = new Order({
      id: 'hello',
      name: 'zoaekzaoek',
    });

    const orderCreated = new OrderCreated({
      name: 'ap^zel',
      id: 'hello',
    });
    order.addDomainEvent(orderCreated);

    await _subReceiver.subscribe({
      topic: 'channel',
      event: OrderCreated,
    }, new OrderCreatedEventHandler());

    await _subReceiver.subscribe({
      topic: 'channel',
      event: OrderRefused,
    }, new OrderRefusedEventHandler());

    await _subManager.dispatch(order);
  });

  it('Should throw error cause no event is provided', async () => {
    const order = new Order({
      id: 'hello',
      name: 'zoaekzaoek',
    });

    const result = _subManager.dispatch(order);

    await expect(result).rejects.toThrow(EventErrors.DomainEventsMapEmpty);
  });

  it('Should dispatch single event', async () => {
    const event = new OrderRefused({
      name: 'aaa',
      id: 'azae',
    });
    const result = _eventDispatcher.dispatch(event);

    await expect(result).resolves.not.toThrow();
  });
});
