import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { buildDomainEventDependencies } from '@oney/ddd';
import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Container } from 'inversify';
import { connect, connection, Connection } from 'mongoose';
import { Identifiers } from './Identifiers';
import { EventStoreMongoRepository } from '../adapters/repository/mongodb/EventStoreMongoRepository';
import { EnvConfig } from '../config/EnvConfig';
import { EventStoreRepository } from '../domain/repository/EventStoreRepository';
import { ProcessDebtCallback } from '../usecases/ProcessDebtCallback';

export class Kernel extends Container {
  constructor() {
    super();
    configureLogger(this);
  }

  async initDependencies(_envConfiguration: EnvConfig): Promise<Container> {
    this.bind<ProcessDebtCallback>(Identifiers.ProcessDebtCallback).to(ProcessDebtCallback);
    this.bind<EventStoreRepository>(Identifiers.EventStoreRepository).to(EventStoreMongoRepository);

    // We ignore this test case because we dont want to test app in Production mode.
    /* istanbul ignore next */
    const mongoPath =
      process.env.NODE_ENV === 'production' ? _envConfiguration.mongoPath : process.env.MONGO_URL;
    await this.initMongooseConnection(mongoPath);

    configureMongoEventHandlerExecution(this);

    buildDomainEventDependencies(this).usePlugin(
      createAzureConnection(
        _envConfiguration.serviceBusUrl,
        _envConfiguration.serviceBusSub,
        _envConfiguration.serviceBusTopic,
        this.get(SymLogger),
        this.get(EventHandlerExecutionFinder),
        this.get(EventHandlerExecutionStore),
      ),
    );

    return this;
  }

  private async initMongooseConnection(url: string): Promise<void> {
    await connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    if (!this.isBound(Connection)) {
      this.bind(Connection).toConstantValue(connection);
    }
  }

  public getDependencies() {
    return {
      processDebtCallback: this.get<ProcessDebtCallback>(Identifiers.ProcessDebtCallback),
    };
  }
}
