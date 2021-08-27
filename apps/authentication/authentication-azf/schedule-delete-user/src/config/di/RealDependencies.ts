import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { Identifier } from './Identifier';
import { MongoDbUserRepository } from '../../adapters/mongodb/MongoDbUserRepository';

export class RealDependencies {
  static initDependencies(container: Container, dbConnection: Connection, dbName: string): void {
    container
      .bind<MongoDbUserRepository>(Identifier.userRepository)
      .toConstantValue(new MongoDbUserRepository(dbConnection.useDb(dbName)));
  }
}
