import { Connection } from 'mongoose';
import 'reflect-metadata';
import { AsyncOrSync } from 'ts-essentials';
import { v4 } from 'uuid';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { MongoScope } from './__fixtures__/MongoScope';
import { AggregatedAccountsIncomesChecked } from './__fixtures__/payment-saga/messages/AggregatedAccountsIncomesChecked';
import { IncomingFrontEvent } from './__fixtures__/payment-saga/messages/IncomingFrontEvent';
import { PaymentAccountLimitCalculated } from './__fixtures__/payment-saga/messages/PaymentAccountLimitCalculated';
import { SMOGlobalOutUpdated } from './__fixtures__/payment-saga/messages/SMOGlobalOutUpdated';
import { PaymentSaga, PaymentSagaState } from './__fixtures__/payment-saga/PaymentSaga';
import { sagaInitialize } from './__fixtures__/SagaInitialize';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';

describe('PaymentSaga', () => {
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
      },
    };
  }

  it('should execute with success the optimistic workflow', async () => {
    await ScopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(PaymentSaga);
      });

      const checkStateValueToBeTrue = async (select: (x: PaymentSagaState) => boolean) => {
        const [activeSaga] = await services.finder.findActiveSagasBySaga(PaymentSaga);
        const value = select(activeSaga.instance.state);
        expect(value).toBe(true);
      };

      {
        await services.dispatch(new IncomingFrontEvent(generateEventParams(3712)));
        await services.checkActiveSagaCount(PaymentSaga, 1);
        await checkStateValueToBeTrue(x => x.handleIncomingFrontEvent);
      }

      {
        await services.dispatch(new AggregatedAccountsIncomesChecked(generateEventParams(3712)));
        await services.checkActiveSagaCount(PaymentSaga, 1);
        await checkStateValueToBeTrue(x => x.handleAggregatedAccountsIncomesChecked);
      }

      {
        await services.dispatch(new PaymentAccountLimitCalculated(generateEventParams(3712)));
        await services.checkActiveSagaCount(PaymentSaga, 1);
        await checkStateValueToBeTrue(x => x.handlePaymentAccountLimitCalculated);
      }

      {
        await services.dispatch(new SMOGlobalOutUpdated(generateEventParams(3712)));
        await services.checkActiveSagaCount(PaymentSaga, 1);
        await checkStateValueToBeTrue(x => x.handleSMOGlobalOutUpdated);
      }
    });
  });

  it('should activate 3 sagas', async () => {
    await ScopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(PaymentSaga);
      });

      {
        await services.dispatch(new IncomingFrontEvent(generateEventParams(1)));
        await services.checkActiveSagaCount(PaymentSaga, 1);
      }

      {
        await services.dispatch(new IncomingFrontEvent(generateEventParams(2)));
        await services.checkActiveSagaCount(PaymentSaga, 2);
      }

      {
        await services.dispatch(new IncomingFrontEvent(generateEventParams(3)));
        await services.checkActiveSagaCount(PaymentSaga, 3);
      }
    });
  });

  it('startedBy event with same correlated props, should not activate a second saga', async () => {
    await ScopeFactory(async connection => {
      const services = await sagaInitialize(connection, r => {
        r.register(PaymentSaga);
      });

      {
        await services.dispatch(new IncomingFrontEvent(generateEventParams(1)));
        await services.checkActiveSagaCount(PaymentSaga, 1);
      }

      {
        await services.dispatch(new IncomingFrontEvent(generateEventParams(1)));
        await services.checkActiveSagaCount(PaymentSaga, 1);
      }
    });
  });
});
