import { Container } from 'inversify';
import {
  SplitPaymentScheduleRepository,
  SplitPaymentSchedule,
  SplitContractRepository,
  SplitContract,
} from '../../../../../core/src/domain';
import {
  InMemorySplitPaymentScheduleRepository,
  InMemorySplitContractRepository,
} from '../../../adapters/inmemory';
import { Identifiers } from '../../Identifiers';

export class InMemoryDependencies {
  static initDependencies(container: Container): void {
    container
      .bind<SplitPaymentScheduleRepository>(Identifiers.splitPaymentScheduleRepository)
      .toConstantValue(new InMemorySplitPaymentScheduleRepository(new Map<string, SplitPaymentSchedule>()));
    container
      .bind<SplitContractRepository>(Identifiers.splitContractRepository)
      .toConstantValue(new InMemorySplitContractRepository(new Map<string, SplitContract>()));
  }
}
