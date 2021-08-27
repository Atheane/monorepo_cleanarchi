import {
  CommandDispatcher,
  EventDispatcher,
  EventReceiver,
  SymTopicProviderFromEventCtor,
  TopicProviderFromEventCtor,
} from '@oney/messages-core';
import {
  InMemoryCorrelatedSagaProvider,
  InMemorySagaActivator,
  InMemorySagaDefinitionStore,
  InMemorySagaEventRouter,
  InMemorySagaExecutionManager,
  InMemorySagaRegistry,
  InMemorySagaSchemaSynchronizer,
  InMemorySagaSubscriptionProvider,
} from '@oney/saga-adapters';
import {
  CorrelatedSagaProvider,
  InMemorySagaIntegrityChecker,
  SagaActivator,
  SagaActiveStore,
  SagaDefinitionStore,
  SagaEventRouter,
  SagaExecutionManager,
  SagaFinder,
  SagaIntegrityChecker,
  SagaOrchestrator,
  SagaRegistry,
  SagaSchemaSynchronizer,
  SagaSubscriptionProvider,
  SymActiveSagaRepository,
  SymSagaTopicProvider,
} from '@oney/saga-core';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { DefaultSagaTopicProvider } from './in-memory/DefaultSagaTopicProvider';
import { DefaultSagaActiveStore } from './mongo/DefaultSagaActiveStore';
import { DefaultSagaFinder } from './mongo/DefaultSagaFinder';
import { ActiveSagaMapper } from './mongo/mongodb/ActiveSagaMapper';
import { MongoActiveSagaRepository } from './mongo/mongodb/MongoActiveSagaRepository';
import { connectActiveSagaModel } from './mongo/mongodb/schemas/ActiveSagaSchema';

export async function configureSaga(
  container: Container,
  cb: (o: SagaRegistry) => AsyncOrSync<void>,
): Promise<void> {
  const connection = container.get(Connection);
  const receiver = container.get(EventReceiver);
  const eventDispatcher = container.get(EventDispatcher);
  const commandDispatcher = container.get(CommandDispatcher);
  const topicProviderFromEvent = container.get<TopicProviderFromEventCtor>(SymTopicProviderFromEventCtor);

  const model = await connectActiveSagaModel(connection);

  const registry = new InMemorySagaRegistry();
  container.bind(InMemorySagaRegistry).toConstantValue(registry);
  container.bind(SagaRegistry).toConstantValue(registry);

  // mongo implementations
  const activator = new InMemorySagaActivator(container, registry);
  container.bind(InMemorySagaActivator).toConstantValue(activator);
  container.bind(SagaActivator).toConstantValue(activator);

  const mapper = new ActiveSagaMapper(activator, registry);
  container.bind(ActiveSagaMapper).toConstantValue(mapper);

  const repository = new MongoActiveSagaRepository(model);
  container.bind(MongoActiveSagaRepository).toConstantValue(repository);
  container.bind(SymActiveSagaRepository).toConstantValue(repository);

  const activeStore = new DefaultSagaActiveStore(repository, mapper);
  container.bind(DefaultSagaActiveStore).toConstantValue(activeStore);
  container.bind(SagaActiveStore).toConstantValue(activeStore);

  const finder = new DefaultSagaFinder(registry, repository, mapper);
  container.bind(DefaultSagaFinder).toConstantValue(finder);
  container.bind(SagaFinder).toConstantValue(finder);

  const definitionStore = new InMemorySagaDefinitionStore();
  container.bind(InMemorySagaDefinitionStore).toConstantValue(definitionStore);
  container.bind(SagaDefinitionStore).toConstantValue(definitionStore);

  const integrityChecker = new InMemorySagaIntegrityChecker(registry, definitionStore, activeStore);
  container.bind(InMemorySagaIntegrityChecker).toConstantValue(integrityChecker);
  container.bind(SagaIntegrityChecker).toConstantValue(integrityChecker);

  const schemaSynchronizer = new InMemorySagaSchemaSynchronizer();
  container.bind(InMemorySagaSchemaSynchronizer).toConstantValue(schemaSynchronizer);
  container.bind(SagaSchemaSynchronizer).toConstantValue(schemaSynchronizer);

  const correlatedProvider = new InMemoryCorrelatedSagaProvider(registry, finder, activator);
  container.bind(InMemoryCorrelatedSagaProvider).toConstantValue(correlatedProvider);
  container.bind(CorrelatedSagaProvider).toConstantValue(correlatedProvider);

  const executionManager = new InMemorySagaExecutionManager(activeStore, eventDispatcher, commandDispatcher);
  container.bind(InMemorySagaExecutionManager).toConstantValue(executionManager);
  container.bind(SagaExecutionManager).toConstantValue(executionManager);

  const subscriptionProvider = new InMemorySagaSubscriptionProvider(executionManager, correlatedProvider);
  container.bind(InMemorySagaSubscriptionProvider).toConstantValue(subscriptionProvider);
  container.bind(SagaSubscriptionProvider).toConstantValue(subscriptionProvider);

  const topicProvider = new DefaultSagaTopicProvider(topicProviderFromEvent);
  container.bind(DefaultSagaTopicProvider).toConstantValue(topicProvider);
  container.bind(SymSagaTopicProvider).toConstantValue(topicProvider);

  const router = new InMemorySagaEventRouter(registry, receiver, subscriptionProvider, topicProvider);
  container.bind(InMemorySagaEventRouter).toConstantValue(router);
  container.bind(SagaEventRouter).toConstantValue(router);

  const orchestrator = new SagaOrchestrator(integrityChecker, schemaSynchronizer, router);
  container.bind(SagaOrchestrator).toConstantValue(orchestrator);

  await cb(registry);

  await orchestrator.start();
}
