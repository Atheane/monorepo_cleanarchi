import 'reflect-metadata';
import { initMongooseConnection } from '@oney/common-adapters';
import { SplitProduct } from '@oney/credit-messages';
import * as dateMock from 'jest-date-mock';
import { SplitSimulationError } from '@oney/credit-core';
import * as path from 'path';
import { getAppConfiguration } from '../../../config/app/AppConfigurationService';
import { DomainDependencies } from '../../di';
import { loadingEnvironmentConfig } from '../../../config/env/EnvConfigurationService';
import {
  getSplitContractModel,
  getSplitPaymentScheduleModel,
  getSplitSimulationModel,
} from '../../adapters/mongodb';
import { initializeKernel } from '../fixtures/initializeKernel';

jest.mock('@azure/service-bus', () => ({
  ReceiveMode: {
    peekLock: 1,
    receiveAndDelete: 2,
  },
  ServiceBusClient: {
    createFromConnectionString: jest.fn().mockReturnValue({
      createTopicClient: jest.fn().mockReturnValue({
        createSender: jest.fn().mockReturnValue({
          send: jest.fn(),
        }),
      }),
      createSubscriptionClient: jest.fn().mockReturnValue({
        createReceiver: jest.fn().mockReturnValue({
          registerMessageHandler: jest.fn(),
        }),
      }),
    }),
  },
}));

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Validate simulation integration testing - implementation mongoDB', () => {
  let dependencies: DomainDependencies;
  const userId = 'OsYFhvKAT';
  const initialTransactionId = 'a-9F3q0Ov';

  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);
    const dbConnection = await initMongooseConnection(process.env.MONGO_URL);
    const configuration = getAppConfiguration();
    configuration.mongoDBConfiguration.odbCreditDbName = process.env.MONGO_DB_NAME;

    const kernel = await initializeKernel(false, configuration, dbConnection);
    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    dateMock.clear();
    await getSplitContractModel().deleteMany({});
    await getSplitPaymentScheduleModel().deleteMany({});
    await getSplitSimulationModel().deleteMany({});
  });

  it('should throw a simulation not found error', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const simulation1 = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });

    // simulation on another device will change first simulation id: cause only one simulation by initialTransactionId
    await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });

    const result = dependencies.validateSplitSimulation.execute({
      simulationId: simulation1[0].id,
    });

    await expect(result).rejects.toThrow(SplitSimulationError.NotFound);
  });
});
