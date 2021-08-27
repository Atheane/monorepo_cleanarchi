import * as mongoose from 'mongoose';
import { Container } from 'inversify';
import {
  SplitSimulationRepository,
  SplitContractRepository,
  SplitPaymentScheduleRepository,
  CreditorRepository,
  IAppConfiguration,
} from '@oney/credit-core';
import { Identifiers } from './Identifiers';
import { SplitSimulationMapper, SplitContractMapper, SplitPaymentScheduleMapper } from '../adapters/mappers';
import {
  MongoDbSplitSimulationRepository,
  MongoDbSplitContractRepository,
  MongoDbSplitPaymentScheduleRepository,
  connectSplitSimulationModel,
  connectSplitContractModel,
  connectSplitPaymentScheduleModel,
  MongoDbCreditorRepository,
} from '../adapters/mongodb';

export class RealDependencies {
  static initDependencies(
    container: Container,
    configuration: IAppConfiguration,
    dbConnection: mongoose.Connection,
  ): void {
    container.bind<SplitSimulationRepository>(Identifiers.splitSimulationRepository).toConstantValue(
      new MongoDbSplitSimulationRepository(
        // fixme review the connection management.
        connectSplitSimulationModel(dbConnection.useDb(configuration.mongoDBConfiguration.odbCreditDbName)),
        new SplitSimulationMapper(),
      ),
    );
    container
      .bind<SplitContractRepository>(Identifiers.splitContractRepository)
      .toConstantValue(
        new MongoDbSplitContractRepository(
          connectSplitContractModel(dbConnection.useDb(configuration.mongoDBConfiguration.odbCreditDbName)),
          new SplitContractMapper(),
        ),
      );
    container
      .bind<SplitPaymentScheduleRepository>(Identifiers.splitPaymentScheduleRepository)
      .toConstantValue(
        new MongoDbSplitPaymentScheduleRepository(
          connectSplitPaymentScheduleModel(
            dbConnection.useDb(configuration.mongoDBConfiguration.odbCreditDbName),
          ),
          new SplitPaymentScheduleMapper(),
        ),
      );
    container
      .bind<CreditorRepository>(Identifiers.creditorRepository)
      .toConstantValue(
        new MongoDbCreditorRepository(dbConnection.useDb(configuration.mongoDBConfiguration.odbCreditDbName)),
      );
  }
}
