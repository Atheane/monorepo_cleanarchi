import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Container } from 'inversify';
import { buildCoreModules, MongoDbQueryService, MongoDbWriteService } from '@oney/common-adapters';
import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { QueryService, WriteService } from '@oney/common-core';
import { buildDomainEventDependencies } from '@oney/ddd';
import { OdbProfileRepositoryRead, OdbProfileRepositoryWrite, ProfileMapper } from '@oney/profile-adapters';
import {
  Identifiers,
  KycRepositoryWrite,
  ProfileRepositoryRead,
  ProfileRepositoryWrite,
} from '@oney/profile-core';
import { Connection, createConnection } from 'mongoose';
import { OdbKycRepositoryWrite } from '../src/repositories/kyc/OdbKycRepositoryWrite';
import { ProcessScoringCallback } from '../src/usecases/ProcessScoringCallback';

interface KycDecisionConfiguration {
  mongoUrl: string;
  mongoCollection: string;
  mongoUrlEventStore: string;
  mongoCollectionEventStore: string;
  inMemoryMode: boolean;
  serviceBusUrl: string;
  serviceBusSub: string;
  serviceBusTopic: string;
}

interface DbConfig {
  mongoUrl: string;
  mongoCollection: string;
}

export interface DbServices {
  dbWrite: WriteService;
  dbRead: QueryService;
}

// We just want to instantiate a new WriteService when needed without needing to bind it
export async function configureDbClient(container: Container, config: DbConfig): Promise<DbServices> {
  const connection = await createConnection(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (!container.isBound(Connection)) {
    container.bind(Connection).toConstantValue(connection);
  }

  const collection = connection.collection(config.mongoCollection);
  return {
    dbWrite: new MongoDbWriteService(collection),
    dbRead: new MongoDbQueryService(collection),
  };
}

export async function buildAzfScoring(
  container: Container,
  config: KycDecisionConfiguration,
): Promise<Container> {
  await buildCoreModules(container, config.inMemoryMode, {
    mongodb: {
      url: config.mongoUrl,
      collection: config.mongoCollection,
    },
  });

  container.bind(ProfileMapper).toSelf();
  container.bind(ProcessScoringCallback).toSelf();
  container.bind<ProfileRepositoryRead>(Identifiers.profileRepositoryRead).to(OdbProfileRepositoryRead);
  container.bind<ProfileRepositoryWrite>(Identifiers.profileRepositoryWrite).to(OdbProfileRepositoryWrite);

  const eventStoreDbService = await configureDbClient(container, {
    mongoUrl: config.mongoUrlEventStore,
    mongoCollection: config.mongoCollectionEventStore,
  });
  container
    .bind<KycRepositoryWrite>(Identifiers.kycRepository)
    .toConstantValue(new OdbKycRepositoryWrite(eventStoreDbService.dbWrite));

  configureMongoEventHandlerExecution(container);
  buildDomainEventDependencies(container).usePlugin(
    createAzureConnection(
      config.serviceBusUrl,
      config.serviceBusSub,
      config.serviceBusTopic,
      container.get(SymLogger),
      container.get(EventHandlerExecutionFinder),
      container.get(EventHandlerExecutionStore),
    ),
  );

  return container;
}
