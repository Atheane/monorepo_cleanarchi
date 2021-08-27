import { Container } from 'inversify';
import {
  SplitPaymentScheduleRepository,
  SplitContractRepository,
} from '../../../../../core/src/domain/repositories';
import { SplitPaymentScheduleMapper, SplitContractMapper } from '../../../adapters/mappers';
import {
  MongoDbSplitPaymentScheduleRepository,
  MongoDbSplitContractRepository,
} from '../../../adapters/mongodb/repositories';
import { Identifiers } from '../../Identifiers';

export class RealDependencies {
  static initDependencies(container: Container): void {
    container
      .bind<SplitPaymentScheduleRepository>(Identifiers.splitPaymentScheduleRepository)
      .toConstantValue(new MongoDbSplitPaymentScheduleRepository(new SplitPaymentScheduleMapper()));
    container
      .bind<SplitContractRepository>(Identifiers.splitContractRepository)
      .toConstantValue(new MongoDbSplitContractRepository(new SplitContractMapper()));
  }
}
