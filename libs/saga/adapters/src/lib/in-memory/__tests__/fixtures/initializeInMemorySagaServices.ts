import { DefaultCommandHandlerActivator, DefaultTopicProviderFromEvent } from '@oney/messages-adapters';
import { CommandHandlerActivator, Event } from '@oney/messages-core';
import {
  TestCommandDispatcher,
  TestCommandReceiver,
  TestEventDispatcher,
  TestEventReceiver,
} from '@oney/messages-test';
import {
  DefaultSagaTopicProvider,
  InMemoryCorrelatedSagaProvider,
  InMemorySagaActivator,
  InMemorySagaActiveStore,
  InMemorySagaCollection,
  InMemorySagaDefinitionStore,
  InMemorySagaEventRouter,
  InMemorySagaExecutionManager,
  InMemorySagaFinder,
  InMemorySagaRegistry,
  InMemorySagaSchemaSynchronizer,
  InMemorySagaSubscriptionProvider,
} from '@oney/saga-adapters';
import { InMemorySagaIntegrityChecker, SagaOrchestrator, SagaState, SagaWorkflowCtor } from '@oney/saga-core';
import { Container } from 'inversify';

export async function initializeInMemorySagaServices() {
  const container = new Container();
  const collection = new InMemorySagaCollection();
  const registry = new InMemorySagaRegistry();
  const definitionStore = new InMemorySagaDefinitionStore();
  const activeStore = new InMemorySagaActiveStore(collection);
  const activator = new InMemorySagaActivator(container, registry);
  const finder = new InMemorySagaFinder(registry, collection);

  const eventReceiver = new TestEventReceiver();
  const eventDispatcher = new TestEventDispatcher(eventReceiver);

  const commandHandlerActivator = new DefaultCommandHandlerActivator(container);
  const commandReceiver = new TestCommandReceiver(commandHandlerActivator);
  const commandDispatcher = new TestCommandDispatcher(commandReceiver);

  const integrityChecker = new InMemorySagaIntegrityChecker(registry, definitionStore, activeStore);
  const schemaSynchronizer = new InMemorySagaSchemaSynchronizer();
  const correlatedProvider = new InMemoryCorrelatedSagaProvider(registry, finder, activator);
  const executionManager = new InMemorySagaExecutionManager(activeStore, eventDispatcher, commandDispatcher);
  const subscriptionProvider = new InMemorySagaSubscriptionProvider(executionManager, correlatedProvider);

  const topicProviderFromEvent = new DefaultTopicProviderFromEvent();
  const topicProvider = new DefaultSagaTopicProvider(topicProviderFromEvent);
  const router = new InMemorySagaEventRouter(registry, eventReceiver, subscriptionProvider, topicProvider);

  const orchestrator = new SagaOrchestrator(integrityChecker, schemaSynchronizer, router);

  return {
    container,
    collection,
    registry,
    definitionStore,
    activeStore,
    activator,
    finder,
    eventReceiver,
    eventDispatcher,
    CommandHandlerActivator,
    commandReceiver,
    commandDispatcher,
    schemaSynchronizer,
    correlatedProvider,
    executionManager,
    integrityChecker,
    subscriptionProvider,
    topicProviderFromEvent,
    topicProvider,
    router,
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
