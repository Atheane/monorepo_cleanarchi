import 'reflect-metadata';
import {
  DefaultSagaActiveStore,
  DefaultSagaFinder,
  InMemorySagaActivator,
  InMemorySagaRegistry,
  MongoActiveSagaRepository,
} from '@oney/saga-adapters';
import { SagaActivator, SagaRegistry } from '@oney/saga-core';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';
import { MongoScope } from './__fixtures__/MongoScope';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { SampleSaga } from './__fixtures__/sample-saga/SampleSaga';
import { ActiveSagaFactory } from './__fixtures__/ActiveSagaFactory';
import { ActiveSagaMapper } from '../mongo/mongodb/ActiveSagaMapper';
import { connectActiveSagaModel } from '../mongo/mongodb/schemas/ActiveSagaSchema';

describe('DefaultSagaFinder', () => {
  SetupMongoMemory();

  const ScopeFactory = async <T>(fn: (connection: Connection) => AsyncOrSync<T>) => {
    await MongoScope(async dbCtx => {
      await MongooseScope(dbCtx.uri, dbCtx.dbName, async connection => {
        return fn(connection);
      });
    });
  };

  let model: ReturnType<typeof connectActiveSagaModel>;
  let container: Container;
  let activator: SagaActivator;
  let registry: SagaRegistry;
  let mapper: ActiveSagaMapper;
  let repository: MongoActiveSagaRepository;
  let store: DefaultSagaActiveStore;
  let finder: DefaultSagaFinder;

  function initialize(connection: Connection) {
    model = connectActiveSagaModel(connection);
    container = new Container();
    registry = new InMemorySagaRegistry();
    activator = new InMemorySagaActivator(container, registry);
    mapper = new ActiveSagaMapper(activator, registry);
    repository = new MongoActiveSagaRepository(model);
    store = new DefaultSagaActiveStore(repository, mapper);
    finder = new DefaultSagaFinder(registry, repository, mapper);
  }

  it('Find from MongoSagaFinder should work', async () => {
    await ScopeFactory(async connection => {
      initialize(connection);

      registry.register(SampleSaga);

      const activeSaga = ActiveSagaFactory.generate();

      await store.persist(activeSaga);

      const [foundActiveSaga] = await finder.findActiveSagasBySaga(SampleSaga);

      expect(foundActiveSaga.activeSagaId).toBe(activeSaga.activeSagaId);
    });
  });
});
