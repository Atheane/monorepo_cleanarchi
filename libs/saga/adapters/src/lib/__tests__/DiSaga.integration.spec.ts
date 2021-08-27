import 'reflect-metadata';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { v4 } from 'uuid';
import { DependantService, DiSaga } from './__fixtures__/di-saga/DiSaga';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { MongoScope } from './__fixtures__/MongoScope';
import { sagaInitialize } from './__fixtures__/SagaInitialize';
import { CompleteOrder } from './__fixtures__/sample-saga/events/CompleteOrder';
import { StartOrder } from './__fixtures__/sample-saga/events/StartOrder';
import { TouchOrder } from './__fixtures__/sample-saga/events/TouchOrder';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';

describe('DiSaga', () => {
  SetupMongoMemory();

  const ScopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  it('should create an active saga instance from di container', async () => {
    await ScopeFactory(async connection => {
      const services = await sagaInitialize(connection, (r, c) => {
        c.bind(DependantService).toSelf();
        r.register(DiSaga);
      });

      await services.dispatch(
        new StartOrder({
          id: v4(),
          props: { orderId: '3712' },
        }),
      );

      await services.checkActiveSagaCount(DiSaga, 1);

      await services.dispatch(
        new TouchOrder({
          id: v4(),
          props: { orderId: '3712' },
        }),
      );

      await services.checkActiveSagaCount(DiSaga, 1);

      await services.dispatch(
        new CompleteOrder({
          id: v4(),
          props: { orderId: '3712' },
        }),
      );

      await services.checkActiveSagaCount(DiSaga, 0);
    });
  });
});
