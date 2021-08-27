import 'reflect-metadata';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { v4 } from 'uuid';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { MongoScope } from './__fixtures__/MongoScope';
import { sagaInitialize } from './__fixtures__/SagaInitialize';
import { CompleteOrder } from './__fixtures__/sample-saga/events/CompleteOrder';
import { HandleByAllSampleSaga } from './__fixtures__/sample-saga/events/HandleByAllSampleSaga';
import { StartOrder } from './__fixtures__/sample-saga/events/StartOrder';
import { SampleSaga } from './__fixtures__/sample-saga/SampleSaga';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';

describe('SampleSaga', () => {
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
        orderId: id,
      },
    };
  }

  it('should activate 3 sagas and all should handle HandleByAllSampleSaga event', async () => {
    await ScopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(SampleSaga);
      });

      {
        await services.dispatch(new StartOrder(generateEventParams(1)));
        await services.dispatch(new StartOrder(generateEventParams(2)));
        await services.dispatch(new StartOrder(generateEventParams(3)));
        await services.checkActiveSagaCount(SampleSaga, 3);
      }

      {
        await services.dispatch(new HandleByAllSampleSaga(generateEventParams({ id: v4() })));
        const activeSagas = await services.getAllActiveSagaBySaga(SampleSaga);
        activeSagas.forEach(x => {
          expect(x.instance.state.handleHandleByAllSampleSaga).toBe(true);
        });
      }
    });
  });

  it('should activate 3 sagas and complete all', async () => {
    await ScopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(SampleSaga);
      });

      {
        await services.dispatch(new StartOrder(generateEventParams(1)));
        await services.dispatch(new StartOrder(generateEventParams(2)));
        await services.dispatch(new StartOrder(generateEventParams(3)));
        await services.checkActiveSagaCount(SampleSaga, 3);
      }

      {
        await services.dispatch(new CompleteOrder(generateEventParams(1)));
        await services.checkActiveSagaCount(SampleSaga, 2);
        await services.dispatch(new CompleteOrder(generateEventParams(3)));
        await services.checkActiveSagaCount(SampleSaga, 1);
        await services.dispatch(new CompleteOrder(generateEventParams(2)));
        await services.checkActiveSagaCount(SampleSaga, 0);
      }
    });
  });

  it('should activate 3 sagas', async () => {
    await ScopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(SampleSaga);
      });

      {
        await services.dispatch(new StartOrder(generateEventParams(1)));
        await services.checkActiveSagaCount(SampleSaga, 1);
      }

      {
        await services.dispatch(new StartOrder(generateEventParams(2)));
        await services.checkActiveSagaCount(SampleSaga, 2);
      }

      {
        await services.dispatch(new StartOrder(generateEventParams(3)));
        await services.checkActiveSagaCount(SampleSaga, 3);
      }
    });
  });
});
