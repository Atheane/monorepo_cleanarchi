import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Container } from 'inversify';
import {
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { buildDomainEventDependencies } from '@oney/ddd';
import { connection, Connection } from 'mongoose';
import { Identifiers } from './Identifiers';
import { IAppConfiguration } from './app/IAppConfiguration';
import { DomainDependencies } from './dependencies/DomainDependencies';
import { InMemoryDependencies } from './dependencies/in-memory/InMemoryDependencies';
import { RealDependencies } from './dependencies/real-dependencies/RealDependencies';
import {
  SplitPaymentScheduleRepository,
  PaymentGateway,
  SplitContractRepository,
  ClosureContractService,
} from '../../../core/src/domain';
import { ProcessPayments, ClosePaidContracts } from '../../../core/src/usecases';
import { ExecutePaymentGateway } from '../adapters/gateways';
import { PaymentExecutionMapper } from '../adapters/mappers';
import { OdbConnectionService, BatchClosureContractsService } from '../adapters/services';

export class Kernel extends Container {
  constructor(private inMemory: boolean, private config: IAppConfiguration) {
    super();
    configureLogger(this);
  }

  public initDependencies(): void {
    if (this.inMemory) {
      configureInMemoryEventHandlerExecution(this);
      InMemoryDependencies.initDependencies(this);
    } else {
      if (!this.isBound(Connection)) {
        this.bind(Connection).toConstantValue(connection);
      }
      configureMongoEventHandlerExecution(this);
      RealDependencies.initDependencies(this);
    }

    this.initConfigs();
    this.initUsecases();
    this.initGateways();
    this.initMappers();
    this.initServices();
    this.initMessagingPlugin();
  }

  private initUsecases() {
    this.bind<ProcessPayments>(ProcessPayments).to(ProcessPayments);
    this.bind<ClosePaidContracts>(ClosePaidContracts).to(ClosePaidContracts);
  }

  private initGateways() {
    this.bind<PaymentGateway>(Identifiers.paymentGateway).to(ExecutePaymentGateway);
  }

  private initServices() {
    this.bind(OdbConnectionService).toConstantValue(new OdbConnectionService(this.config));
    this.bind<ClosureContractService>(Identifiers.closureContractsService).to(BatchClosureContractsService);
  }

  private initConfigs() {
    this.bind<IAppConfiguration>(Identifiers.appConfiguration).toConstantValue(this.config);
  }

  private initMappers() {
    this.bind<PaymentExecutionMapper>(Identifiers.mappers.paymentExecutionMapper).to(PaymentExecutionMapper);
  }

  getDependencies(): DomainDependencies {
    return {
      processPayments: this.get(ProcessPayments),
      closePaidContracts: this.get(ClosePaidContracts),
      splitPaymentScheduleRepository: this.get<SplitPaymentScheduleRepository>(
        Identifiers.splitPaymentScheduleRepository,
      ),
      splitContractRepository: this.get<SplitContractRepository>(Identifiers.splitContractRepository),
      paymentGateway: this.get<PaymentGateway>(Identifiers.paymentGateway),
      closureContractService: this.get<ClosureContractService>(Identifiers.closureContractsService),
    };
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
}
