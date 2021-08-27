import 'reflect-metadata';
import { Awaited } from 'ts-essentials';
import { v4 } from 'uuid';
import { initializeInMemorySagaServices } from './fixtures/initializeInMemorySagaServices';
import { CompleteOrder } from './fixtures/sample-saga/events/CompleteOrder';
import { StartOrder } from './fixtures/sample-saga/events/StartOrder';
import { SampleSaga } from './fixtures/sample-saga/SampleSaga';

describe('SagaOrchestrator', () => {
  let services: Awaited<ReturnType<typeof initializeInMemorySagaServices>>;

  beforeEach(async () => {
    services = await initializeInMemorySagaServices();
  });

  function generateEventParams(id) {
    return {
      id: v4(),
      props: {
        orderId: id,
      },
    };
  }

  it('should start only one saga', async () => {
    services.registry.register(SampleSaga);

    await services.orchestrator.start();

    {
      await services.eventDispatcher.dispatch(new StartOrder(generateEventParams('3712')));

      const activeSagas = await services.finder.findActiveSagasBySaga(SampleSaga);

      expect(activeSagas.length).toBe(1);
    }

    {
      await services.eventDispatcher.dispatch(new StartOrder(generateEventParams('3712')));

      const activeSagas = await services.finder.findActiveSagasBySaga(SampleSaga);

      expect(activeSagas.length).toBe(1);
    }
  });

  it('should mark as complete', async () => {
    services.registry.register(SampleSaga);

    await services.orchestrator.start();

    {
      const event = new StartOrder(generateEventParams('3712'));

      await services.eventDispatcher.dispatch(event);

      const [activeSaga] = await services.finder.findActiveSagasBySaga(SampleSaga);

      expect(activeSaga.history[0].event).toMatchObject({ props: { orderId: '3712' } });
    }

    {
      await services.eventDispatcher.dispatch(new CompleteOrder(generateEventParams('3712')));

      const [activeSaga] = await services.finder.findCompletedSagasBySaga(SampleSaga);

      expect(activeSaga.instance.completedAt).toBeDefined();
    }
  });

  it('should not process same event 2 times', async () => {
    services.registry.register(SampleSaga);

    await services.orchestrator.start();

    {
      await services.eventDispatcher.dispatch(new StartOrder(generateEventParams('3712')));
      await services.eventDispatcher.dispatch(new CompleteOrder(generateEventParams('3712')));
      await services.eventDispatcher.dispatch(new CompleteOrder(generateEventParams('3712')));

      const [activeSaga] = await services.finder.findCompletedSagasBySaga(SampleSaga);

      expect(activeSaga.history.length).toBe(2);
    }
  });
});
