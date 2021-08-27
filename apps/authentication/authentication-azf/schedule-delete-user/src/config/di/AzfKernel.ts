import {
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { buildDomainEventDependencies } from '@oney/ddd';
import { DomainDependencies } from './DomainDependencies';
import { Identifier } from './Identifier';
import { InMemoryDependencies } from './InMemoryDependencies';
import { RealDependencies } from './RealDependencies';
import { IAzfConfiguration } from '../envs';
import { DeleteUsers } from '../../core/usecases/DeleteUsers';
import { UserRepository } from '../../core/domain/repositories/UserRepository';

export class AzfKernel extends Container {
  constructor(private readonly config: IAzfConfiguration) {
    super();
    configureLogger(this);
  }

  initDependencies(dbConnection?: Connection): AzfKernel {
    if (!dbConnection) {
      configureInMemoryEventHandlerExecution(this);
      InMemoryDependencies.initDependencies(this);
    } else {
      if (!this.isBound(Connection)) {
        this.bind(Connection).toConstantValue(dbConnection);
      }

      configureMongoEventHandlerExecution(this);
      const { dbName } = this.config.cosmosDbConfiguration;
      RealDependencies.initDependencies(this, dbConnection, dbName);
    }

    this.initConfigs();
    this.initUsecases();
    this.initMessagingPlugin();
    return this;
  }

  private initConfigs(): void {
    this.bind<IAzfConfiguration>(Identifier.config).toConstantValue(this.config);
  }

  private initUsecases(): void {
    this.bind<DeleteUsers>(DeleteUsers).to(DeleteUsers);
  }

  public initMessagingPlugin(): void {
    const { connectionString, topic, subscription } = this.config.serviceBusConfiguration;
    const messagingPlugin = createAzureConnection(
      connectionString,
      subscription,
      topic,
      this.get(SymLogger),
      this.get(EventHandlerExecutionFinder),
      this.get(EventHandlerExecutionStore),
    );
    buildDomainEventDependencies(this).usePlugin(messagingPlugin);
  }

  getDependencies(): DomainDependencies {
    return {
      deleteUsers: this.get(DeleteUsers),
      userRepository: this.get<UserRepository>(Identifier.userRepository),
    };
  }
}
