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
  configureSaga,
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

export async function sagaInitialize(
  connection: Connection,
  cb: (r: SagaRegistry, c: Container) => AsyncOrSync<void>,
  container: Container,
): Promise<any> {
  {
    const eventReceiver = new TestEventReceiver();
    const eventDispatcher = new TestEventDispatcher(eventReceiver);

    container.bind(TestEventReceiver).toConstantValue(eventReceiver);
    container.rebind(EventReceiver).toConstantValue(eventReceiver);

    container.bind(TestEventDispatcher).toConstantValue(eventDispatcher);
    container.rebind(EventDispatcher).toConstantValue(eventDispatcher);
  }

  {
    const commandHandlerActivator = new DefaultCommandHandlerActivator(container);
    const commandReceiver = new TestCommandReceiver(commandHandlerActivator);
    const commandDispatcher = new TestCommandDispatcher(commandReceiver);

    container.bind(DefaultCommandHandlerActivator).toConstantValue(commandHandlerActivator);
    container.bind(CommandHandlerActivator).toConstantValue(commandHandlerActivator);

    container.bind(TestCommandReceiver).toConstantValue(commandReceiver);
    container.bind(CommandReceiver).toConstantValue(commandReceiver);

    container.bind(TestCommandDispatcher).toConstantValue(commandDispatcher);
    container.bind(CommandDispatcher).toConstantValue(commandDispatcher);
  }

  container.rebind(SymTopicProviderFromEventCtor).to(DefaultTopicProviderFromEvent);

  await configureSaga(container, async r => await cb(r, container));

  const finder = container.get(DefaultSagaFinder);

  const dispatcher = container.get(EventDispatcher);
  const receiver = container.get(EventReceiver);
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
    receiver,
    dispatcher,
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
    dispatch: async (event: Event) => {
      await dispatcher.dispatch(event);
    },
    getAllActiveSagaBySaga: async <TSagaState extends SagaState>(saga: SagaWorkflowCtor<TSagaState>) => {
      return await finder.findActiveSagasBySaga<TSagaState>(saga);
    },
  };
}
