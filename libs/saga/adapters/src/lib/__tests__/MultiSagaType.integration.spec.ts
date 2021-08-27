import 'reflect-metadata';
import { EventDispatcher, EventReceiver } from '@oney/messages-core';
import { RxEventDispatcher, RxEventReceiver, RxServiceBus } from '@oney/rx-events-adapters';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { v4 } from 'uuid';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { MongoScope } from './__fixtures__/MongoScope';
import { IncomingFrontEvent } from './__fixtures__/payment-saga/messages/IncomingFrontEvent';
import { PaymentSaga } from './__fixtures__/payment-saga/PaymentSaga';
import { sagaInitialize } from './__fixtures__/SagaInitialize';
import { StartOrder } from './__fixtures__/sample-saga/events/StartOrder';
import { SampleSaga } from './__fixtures__/sample-saga/SampleSaga';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';

describe('MultiSagaType', () => {
  SetupMongoMemory();

  const ScopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  function generateEventParams(id) {
    return {
      id: v4(),
      props: {
        userId: id,
        orderId: id,
      },
    };
  }

  it('should activate 4 sagas', async () => {
    await ScopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(SampleSaga);
        r.register(PaymentSaga);
      });

      {
        await services.dispatch(new StartOrder(generateEventParams(1)));
        await services.dispatch(new IncomingFrontEvent(generateEventParams(2)));
        await services.dispatch(new StartOrder(generateEventParams(3)));
        await services.dispatch(new IncomingFrontEvent(generateEventParams(4)));

        await services.checkActiveSagaCount(SampleSaga, 2);
        await services.checkActiveSagaCount(PaymentSaga, 2);
      }
    });
  });

  it('should activate 3 sagas with rx service bus', async () => {
    await ScopeFactory(async connection => {
      const container = new Container();

      const serviceBus = new RxServiceBus();
      const dispatcher = new RxEventDispatcher(serviceBus);
      const receiver = new RxEventReceiver(serviceBus);
      container.bind(RxServiceBus).toConstantValue(serviceBus);

      container.bind(RxEventReceiver).toConstantValue(receiver);
      container.bind(EventReceiver).toConstantValue(receiver);

      container.bind(RxEventDispatcher).toConstantValue(dispatcher);
      container.bind(EventDispatcher).toConstantValue(dispatcher);

      const services = await sagaInitialize(
        connection,
        r => {
          r.register(PaymentSaga);
          r.register(SampleSaga);
        },
        container,
      );

      //await sleep(100);

      const promise = receiver.waitEvents(3);

      await services.dispatch(new StartOrder(generateEventParams(1)));
      await services.dispatch(new StartOrder(generateEventParams(2)));
      await services.dispatch(new IncomingFrontEvent(generateEventParams(3)));

      await promise;

      await services.checkActiveSagaCount(SampleSaga, 2);
      await services.checkActiveSagaCount(PaymentSaga, 1);
    });
  });
});
