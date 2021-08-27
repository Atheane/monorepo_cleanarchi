import 'reflect-metadata';
import {
  DefaultSagaActiveStore,
  InMemorySagaActivator,
  InMemorySagaRegistry,
  MongoActiveSagaRepository,
} from '@oney/saga-adapters';
import { SagaActivator, SagaRegistry } from '@oney/saga-core';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { ActiveSagaFactory } from './__fixtures__/ActiveSagaFactory';
import { SetupMongoMemory } from './__fixtures__/SetupMongoMemory';
import { MongoScope } from './__fixtures__/MongoScope';
import { MongooseScope } from './__fixtures__/MongooseScope';
import { ActiveSagaMapper } from '../mongo/mongodb/ActiveSagaMapper';
import { connectActiveSagaModel } from '../mongo/mongodb/schemas/ActiveSagaSchema';

describe('DefaultSagaActiveStore', () => {
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
  let mapper: ActiveSagaMapper;
  let registry: SagaRegistry;
  let repository: MongoActiveSagaRepository;
  let store: DefaultSagaActiveStore;

  function initialize(connection: Connection) {
    model = connectActiveSagaModel(connection);
    container = new Container();
    registry = new InMemorySagaRegistry();
    activator = new InMemorySagaActivator(container, registry);
    mapper = new ActiveSagaMapper(activator, registry);
    repository = new MongoActiveSagaRepository(model);
    store = new DefaultSagaActiveStore(repository, mapper);
  }

  it('Persist from ActiveSagaRepository should work', async () => {
    await ScopeFactory(async connection => {
      initialize(connection);

      const activeSaga = ActiveSagaFactory.generate();
      const mappedSaga = mapper.toPersistence(activeSaga);

      await repository.persist(mappedSaga);

      const [foundActiveSaga] = await repository.find(
        activeSaga.definition.namespace,
        activeSaga.definition.id,
        activeSaga.definition.version,
      );

      expect(foundActiveSaga.activeSagaId).toBe(activeSaga.activeSagaId);
    });
  });

  it('Persist from MongoSagaActiveStore should work', async () => {
    await ScopeFactory(async connection => {
      initialize(connection);

      const activeSaga = ActiveSagaFactory.generate();

      await store.persist(activeSaga);

      const [foundActiveSaga] = await repository.find(
        activeSaga.definition.namespace,
        activeSaga.definition.id,
        activeSaga.definition.version,
      );

      expect(foundActiveSaga.activeSagaId).toBe(activeSaga.activeSagaId);
    });
  });
});
