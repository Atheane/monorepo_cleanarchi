import { Container } from 'inversify';
import {
  SplitSimulationRepository,
  SplitContractRepository,
  SplitPaymentScheduleRepository,
  CreditorRepository,
  SplitSimulationProperties,
  SplitContractProperties,
  SplitPaymentScheduleProperties,
  CreditorProperties,
} from '@oney/credit-core';
import { Identifiers } from './Identifiers';
import {
  InMemorySplitSimulationRepository,
  InMemorySplitContractRepository,
  InMemorySplitPaymentScheduleRepository,
  InMemoryCreditorRepository,
} from '../adapters/inmemory';

export class InMemoryDependencies {
  static initDependencies(container: Container): void {
    container
      .bind<SplitSimulationRepository>(Identifiers.splitSimulationRepository)
      .toConstantValue(new InMemorySplitSimulationRepository(new Map<string, SplitSimulationProperties>()));
    container
      .bind<SplitContractRepository>(Identifiers.splitContractRepository)
      .toConstantValue(new InMemorySplitContractRepository(new Map<string, SplitContractProperties>()));
    container
      .bind<SplitPaymentScheduleRepository>(Identifiers.splitPaymentScheduleRepository)
      .toConstantValue(
        new InMemorySplitPaymentScheduleRepository(new Map<string, SplitPaymentScheduleProperties>()),
      );
    container
      .bind<CreditorRepository>(Identifiers.creditorRepository)
      .toConstantValue(new InMemoryCreditorRepository(new Map<string, CreditorProperties>()));
  }
}
