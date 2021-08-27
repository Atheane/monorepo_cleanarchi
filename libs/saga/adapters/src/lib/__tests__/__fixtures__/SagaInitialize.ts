import { DefaultCommandHandlerActivator, DefaultTopicProviderFromEvent } from '@oney/messages-adapters';
import {
  CommandDispatcher,
  CommandHandlerActivator,
  CommandReceiver,
  Event,
  EventDispatcher,
  EventReceiver,
  SymTopicProviderFromEventCtor,
} from '@oney/messages-core';
import {
  TestCommandDispatcher,
  TestCommandReceiver,
  TestEventDispatcher,
  TestEventReceiver,
} from '@oney/messages-test';
import {
  ActiveSagaMapper,
  DefaultSagaActiveStore,
  DefaultSagaFinder,
  MongoActiveSagaRepository,
} from '@oney/saga-adapters';
import {
  CorrelatedSagaProvider,
  SagaActivator,
  SagaDefinitionStore,
  SagaEventRouter,
  SagaExecutionManager,
  SagaIntegrityChecker,
  SagaOrchestrator,
  SagaRegistry,
  SagaSchemaSynchronizer,
  SagaState,
  SagaSubscriptionProvider,
  SagaWorkflowCtor,
} from '@oney/saga-core';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { configureSaga } from '../../configureSaga';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function sagaInitialize(
  connection: Connection,
  cb: (r: SagaRegistry, c: Container) => AsyncOrSync<void>,
  container: Container = undefined,
) {
  container = container ?? new Container();

  if (!container.isBound(Connection)) {
    container.bind(Connection).toConstantValue(connection);
  }

  {
    const eventReceiver = new TestEventReceiver();
    const eventDispatcher = new TestEventDispatcher(eventReceiver);
    container.bind(TestEventReceiver).toConstantValue(eventReceiver);
    if (!container.isBound(EventReceiver)) {
      container.bind(EventReceiver).toConstantValue(eventReceiver);
    }
    container.bind(TestEventDispatcher).toConstantValue(eventDispatcher);
    if (!container.isBound(EventDispatcher)) {
      container.bind(EventDispatcher).toConstantValue(eventDispatcher);
    }
  }

  {
    const commandHandlerActivator = new DefaultCommandHandlerActivator(container);
    const commandReceiver = new TestCommandReceiver(commandHandlerActivator);
    const commandDispatcher = new TestCommandDispatcher(commandReceiver);
    container.bind(DefaultCommandHandlerActivator).toConstantValue(commandHandlerActivator);
    if (!container.isBound(CommandHandlerActivator)) {
      container.bind(CommandHandlerActivator).toConstantValue(commandHandlerActivator);
    }

    container.bind(TestCommandReceiver).toConstantValue(commandReceiver);
    if (!container.isBound(CommandReceiver)) {
      container.bind(CommandReceiver).toConstantValue(commandReceiver);
    }

    container.bind(TestCommandDispatcher).toConstantValue(commandDispatcher);
    if (!container.isBound(CommandDispatcher)) {
      container.bind(CommandDispatcher).toConstantValue(commandDispatcher);
    }
  }

  container.bind(SymTopicProviderFromEventCtor).to(DefaultTopicProviderFromEvent);

  await configureSaga(container, async r => await cb(r, container));

  const finder = container.get(DefaultSagaFinder);

  const eventDispatcher = container.get(EventDispatcher);
  const eventReceiver = container.get(EventReceiver);
  const commandDispatcher = container.get(CommandDispatcher);
  const commandReceiver = container.get(CommandReceiver);
  const registry = container.get(SagaRegistry);
  const mapper = container.get(ActiveSagaMapper);
  const repository = container.get(MongoActiveSagaRepository);
  const activeStore = container.get(DefaultSagaActiveStore);
  const definitionStore = container.get(SagaDefinitionStore);
  const subscriptionProvider = container.get(SagaSubscriptionProvider);
  const integrityChecker = container.get(SagaIntegrityChecker);
  const schemaSynchronizer = container.get(SagaSchemaSynchronizer);
  const router = container.get(SagaEventRouter);
  const activator = container.get(SagaActivator);
  const correlatedProvider = container.get(CorrelatedSagaProvider);
  const executionManager = container.get(SagaExecutionManager);
  const orchestrator = container.get(SagaOrchestrator);

  return {
    container,
    eventReceiver,
    eventDispatcher,
    commandDispatcher,
    commandReceiver,
    finder,
    registry,
    mapper,
    repository,
    activeStore,
    definitionStore,
    subscriptionProvider,
    integrityChecker,
    schemaSynchronizer,
    router,
    activator,
    correlatedProvider,
    executionManager,
    orchestrator,
    checkActiveSagaCount: async (saga: SagaWorkflowCtor, count) => {
      const activeSagas = await finder.findActiveSagasBySaga(saga);
      expect(activeSagas.length).toBe(count);
    },
    dispatch: async (event: Event) => {
      await eventDispatcher.dispatch(event);
    },
    getAllActiveSagaBySaga: async <TSagaState extends SagaState>(saga: SagaWorkflowCtor<TSagaState>) => {
      return await finder.findActiveSagasBySaga<TSagaState>(saga);
    },
  };
}
