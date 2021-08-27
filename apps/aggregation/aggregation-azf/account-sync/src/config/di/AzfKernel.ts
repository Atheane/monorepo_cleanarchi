import { BankConnectionDeleted } from '@oney/aggregation-messages';
import {
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { buildDomainEventDependencies } from '@oney/ddd';
import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { configureEventHandler } from '@oney/messages-adapters';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Container } from 'inversify';
import { Connection } from 'mongoose';
import { DomainDependencies } from './DomainDependencies';
import { Identifier } from './Identifier';
import { InMemoryDependencies } from './InMemoryDependencies';
import { RealDependencies } from './RealDependencies';
import { BudgetInsightConnectionService } from '../../core/adapters/budgetInsight/repositories/BudgetInsightConnectionService';
import { BankConnectionDeletedHandler } from '../../core/domain/events/handlers/BankConnectionDeletedHandler';
import { BankConnectionRepository, EventRepository } from '../../core/domain/repositories';
import {
  DeleteTransactionsByConnectionId,
  GetBankByName,
  GetBankConnectionByAccountId,
  SaveEvents,
} from '../../core/usecases';
import { IAzfConfiguration } from '../envs';

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
      RealDependencies.initDependencies(this, dbConnection);
    }

    this.initConfigs();
    this.initServices();
    this.initUsecases();

    const { connectionString, subscription, topic } = this.config.serviceBusConfiguration;
    buildDomainEventDependencies(this).usePlugin(
      createAzureConnection(
        connectionString,
        subscription,
        topic,
        this.get(SymLogger),
        this.get(EventHandlerExecutionFinder),
        this.get(EventHandlerExecutionStore),
      ),
    );
    return this;
  }

  private initConfigs(): void {
    this.bind<IAzfConfiguration>(Identifier.config).toConstantValue(this.config);
  }

  private initUsecases(): void {
    this.bind<GetBankConnectionByAccountId>(GetBankConnectionByAccountId).to(GetBankConnectionByAccountId);
    this.bind<GetBankByName>(GetBankByName).to(GetBankByName);
    this.bind<SaveEvents>(SaveEvents).to(SaveEvents);
    this.bind<DeleteTransactionsByConnectionId>(DeleteTransactionsByConnectionId).to(
      DeleteTransactionsByConnectionId,
    );
  }

  private initServices(): void {
    this.bind<BudgetInsightConnectionService>(Identifier.biConnectionService).to(
      BudgetInsightConnectionService,
    );
  }

  async initSubscribers(): Promise<void> {
    await configureEventHandler(this, em => {
      // @oney/aggregation -> this.config.serviceBusConfiguration.topic
      em.register(BankConnectionDeleted, BankConnectionDeletedHandler, {
        topic: this.config.serviceBusConfiguration.topic,
      });
    });
  }

  getDependencies(): DomainDependencies {
    return {
      azfConfiguration: this.config,
      getBankConnectionByAccountId: this.get(GetBankConnectionByAccountId),
      getBankByName: this.get(GetBankByName),
      saveEvents: this.get(SaveEvents),
      bankConnectionRepository: this.get<BankConnectionRepository>(Identifier.bankConnectionRepository),
      eventRepository: this.get<EventRepository>(Identifier.eventRepository),
    };
  }
}
