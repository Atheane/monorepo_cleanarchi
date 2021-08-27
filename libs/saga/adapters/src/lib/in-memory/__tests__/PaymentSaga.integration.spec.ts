import 'reflect-metadata';
import { Awaited } from 'ts-essentials';
import { v4 } from 'uuid';
import { initializeInMemorySagaServices } from './fixtures/initializeInMemorySagaServices';
import { AggregatedAccountsIncomesChecked } from './fixtures/payment-saga/messages/AggregatedAccountsIncomesChecked';
import { IncomingFrontEvent } from './fixtures/payment-saga/messages/IncomingFrontEvent';
import { PaymentAccountLimitCalculated } from './fixtures/payment-saga/messages/PaymentAccountLimitCalculated';
import { SMOGlobalOutUpdated } from './fixtures/payment-saga/messages/SMOGlobalOutUpdated';
import { PaymentSaga, PaymentSagaState } from './fixtures/payment-saga/PaymentSaga';

describe('SagaOrchestrator', () => {
  let services: Awaited<ReturnType<typeof initializeInMemorySagaServices>>;

  beforeEach(async () => {
    services = await initializeInMemorySagaServices();
  });

  it('should execute with success the optimistic workflow', async () => {
    services.registry.register(PaymentSaga);

    await services.orchestrator.start();

    const eventCtorParams = {
      id: v4(),
      props: {
        userId: '3712',
      },
    };

    const checkActiveSagaCount = async () => {
      const activeSagas = await services.finder.findActiveSagasBySaga(PaymentSaga);
      expect(activeSagas.length).toBe(1);
    };

    const checkStateValueToBeTrue = async (select: (x: PaymentSagaState) => boolean) => {
      const [activeSaga] = await services.finder.findActiveSagasBySaga(PaymentSaga);
      const value = select(activeSaga.instance.state);
      expect(value).toBe(true);
    };

    {
      await services.eventDispatcher.dispatch(new IncomingFrontEvent(eventCtorParams));
      await checkActiveSagaCount();
      await checkStateValueToBeTrue(x => x.handleIncomingFrontEvent);
    }

    {
      await services.eventDispatcher.dispatch(new AggregatedAccountsIncomesChecked(eventCtorParams));
      await checkActiveSagaCount();
      await checkStateValueToBeTrue(x => x.handleAggregatedAccountsIncomesChecked);
    }

    {
      await services.eventDispatcher.dispatch(new PaymentAccountLimitCalculated(eventCtorParams));
      await checkActiveSagaCount();
      await checkStateValueToBeTrue(x => x.handlePaymentAccountLimitCalculated);
    }

    {
      await services.eventDispatcher.dispatch(new SMOGlobalOutUpdated(eventCtorParams));
      await checkActiveSagaCount();
      await checkStateValueToBeTrue(x => x.handleSMOGlobalOutUpdated);
    }
  });
});
