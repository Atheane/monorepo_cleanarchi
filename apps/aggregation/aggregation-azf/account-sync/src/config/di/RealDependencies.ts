import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { Identifier } from './Identifier';
import {
  BankConnectionsMongoDbRepository,
  EventsMongoDbRepository,
} from '../../core/adapters/mongodb/repositories';
import { EventRepository } from '../../core/domain/repositories';
import { BankConnectionRepository } from '../../core/domain/repositories/BankConnectionRepository';

export class RealDependencies {
  static initDependencies(container: Container, dbConnection: Connection): void {
    container
      .bind<BankConnectionRepository>(Identifier.bankConnectionRepository)
      .toConstantValue(new BankConnectionsMongoDbRepository(dbConnection.useDb('odb_aggregation')));
    container
      .bind<EventRepository>(Identifier.eventRepository)
      .toConstantValue(new EventsMongoDbRepository(dbConnection.useDb('odb_eventstore')));
  }
}
