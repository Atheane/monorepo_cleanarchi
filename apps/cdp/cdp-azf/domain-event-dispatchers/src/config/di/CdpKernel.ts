import { configureInMemoryEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { configureLogger } from '@oney/logger-adapters';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Container } from 'inversify';
import { buildDomainEventDependencies } from '@oney/ddd';
import { connection } from 'mongoose';
import { CdpIdentifier } from './CdpIdentifier';
import { IAzfConfiguration } from '../envs';
import {
  DispatchAccountEligibility,
  DispatchAggregatedAccountsIncomes,
  DispatchCustomBalanceLimit,
  DispatchPreEligibility,
  DispatchX3X4Eligibility,
} from '../../core/usecases';

export class CdpKernel extends Container {
  constructor(private readonly config: IAzfConfiguration) {
    super();
    configureLogger(this);
  }

  initDependencies(): CdpKernel {
    this.initConfigs();
    this.initMessagingPlugin();
    this.initUsecase();
    return this;
  }

  private initConfigs(): void {
    this.bind<IAzfConfiguration>(CdpIdentifier.config).toConstantValue(this.config);
  }

  public initMessagingPlugin(): void {
    const { connectionString, topic, subscription } = this.config.serviceBusConfiguration;
    // todo remove the in memory implementation
    configureInMemoryEventHandlerExecution(this);
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

  public initUsecase(): void {
    this.bind<DispatchX3X4Eligibility>(DispatchX3X4Eligibility).to(DispatchX3X4Eligibility);
    this.bind<DispatchAccountEligibility>(DispatchAccountEligibility).to(DispatchAccountEligibility);
    this.bind<DispatchPreEligibility>(DispatchPreEligibility).toSelf();
    this.bind<DispatchCustomBalanceLimit>(DispatchCustomBalanceLimit).toSelf();
    this.bind<DispatchAggregatedAccountsIncomes>(DispatchAggregatedAccountsIncomes).toSelf();
  }

  // getDependencies(): DomainDependencies {
  //   return {
  //     dispatchX3X4Eligibility: this.get(DispatchX3X4Eligibility),
  //     dispatchAccountEligibility: this.get(DispatchAccountEligibility),
  //     dispatchPreEligibility: this.get(DispatchPreEligibility),
  //     dispatchCustomBalanceLimit: this.get(DispatchCustomBalanceLimit),
  //     dispatchAggregateAccountsIncomes: this.get(DispatchAggregatedAccountsIncomes),
  //   };
  // }
}
