import 'reflect-metadata';
import { Awaited } from 'ts-essentials';
import { v4 } from 'uuid';
import { initializeInMemorySagaServices } from './fixtures/initializeInMemorySagaServices';
import { PaymentSaga } from './fixtures/payment-saga/PaymentSaga';
import { CompleteOrder } from './fixtures/sample-saga/events/CompleteOrder';
import { StartOrder } from './fixtures/sample-saga/events/StartOrder';
import { SampleSaga, SampleSagaState } from './fixtures/sample-saga/SampleSaga';

describe('SagaOrchestrator', () => {
  let services: Awaited<ReturnType<typeof initializeInMemorySagaServices>>;

  beforeEach(async () => {
    services = await initializeInMemorySagaServices();
  });

  const checkActiveSagaCount = async (count: number) => {
    const activeSagas = await services.finder.findActiveSagasBySaga(PaymentSaga);
    expect(activeSagas.length).toBe(count);
  };

  const checkCompletedSagaCount = async (count: number) => {
    const activeSagas = await services.finder.findCompletedSagasBySaga(PaymentSaga);
    expect(activeSagas.length).toBe(count);
  };

  const checkStateValueToBeTrue = async (select: (x: SampleSagaState) => boolean) => {
    const [activeSaga] = await services.finder.findActiveSagasBySaga(SampleSaga);
    const value = select(activeSaga.instance.state);
    expect(value).toBe(true);
  };

  function generateEventParams(id) {
    return {
      id: v4(),
      props: {
        orderId: id,
      },
    };
  }

  it('should not call a completed saga', async () => {
    services.registry.register(SampleSaga);

    await services.orchestrator.start();

    {
      await services.eventDispatcher.dispatch(new StartOrder(generateEventParams('3712')));

      await checkActiveSagaCount(1);
      await checkStateValueToBeTrue(x => x.handleStartOrderCalled);
    }

    {
      await services.eventDispatcher.dispatch(new CompleteOrder(generateEventParams('3712')));

      // completed
      await checkActiveSagaCount(0);
      await checkCompletedSagaCount(1);
    }

    {
      await services.eventDispatcher.dispatch(new CompleteOrder(generateEventParams('3712')));

      await checkActiveSagaCount(0);
      await checkCompletedSagaCount(1);
    }
  });
});
