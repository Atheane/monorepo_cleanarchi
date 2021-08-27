import { CoreTypes, QueryService, WriteService } from '@oney/common-core';
import { Container } from 'inversify';
import { Collection, Connection, connection as defaultConnection, createConnection } from 'mongoose';
import { InMemoryQueryService } from './persistences/inmemory/InMemoryQueryService';
import { InMemoryWriteService } from './persistences/inmemory/InMemoryWriteService';
import { MongoDbQueryService } from './persistences/mongodb/MongoDbQueryService';
import { MongoDbWriteService } from './persistences/mongodb/MongoDbWriteService';

export interface CoreModuleConfiguration {
  mongodb: {
    url: string;
    collection: string;
  };
}

export async function buildCoreModules(
  container: Container,
  useInMemory: boolean,
  config: CoreModuleConfiguration,
): Promise<void> {
  const inMemoryDb: Map<string, any> = new Map<string, any>();
  let collection: Collection;
  if (!useInMemory) {
    const connection = await createConnection(config.mongodb.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (!container.isBound(Connection)) {
      container.bind(Connection).toConstantValue(connection);
    }

    collection = connection.collection(config.mongodb.collection);
  } else {
    if (!container.isBound(Connection)) {
      container.bind(Connection).toConstantValue(defaultConnection);
    }
  }
  container.bind<QueryService>(CoreTypes.queryService).toDynamicValue(() => {
    /* istanbul ignore if: As we connect directly to account management db, we ignore test with mongodb. */
    if (useInMemory) {
      return new InMemoryQueryService(inMemoryDb);
    }
    return new MongoDbQueryService(collection);
  });

  container.bind<WriteService>(CoreTypes.writeService).toDynamicValue(() => {
    /* istanbul ignore if: As we connect directly to account management db, we ignore test with mongodb. */
    if (useInMemory) {
      return new InMemoryWriteService(inMemoryDb);
    }
    return new MongoDbWriteService(collection);
  });
}
