import 'reflect-metadata';
import { initMongooseConnection } from '@oney/common-adapters';
import { SplitProduct } from '@oney/credit-messages';
import * as dateMock from 'jest-date-mock';
import * as nock from 'nock';
import { SplitContractError, SplitPaymentScheduleError } from '@oney/credit-core';
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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures`);
nockBack.setMode('record');

const nockBefore = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => ({
    ...JSON.parse(body),
    contractNumber: aRecordedBody.contractNumber,
  });
};

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Get split contract integration testing - implementation mongoDB', () => {
  let dependencies: DomainDependencies;
  const userId = 'OsYFhvKAT';
  let initialTransactionId = 'a-9F3q0Ov';

  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);
    const configuration = getAppConfiguration();
    const dbConnection = await initMongooseConnection(process.env.MONGO_URL);
    const kernel = await initializeKernel(false, configuration, dbConnection);
    dependencies = kernel.getDependencies();
    initialTransactionId = 'a-9F3q0Ov';
  });

  beforeEach(async () => {
    dateMock.clear();
    await getSplitContractModel().deleteMany({});
    await getSplitPaymentScheduleModel().deleteMany({});
    await getSplitSimulationModel().deleteMany({});
  });

  it('should get an error when no split created', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = dependencies.getOneSplitContract.execute({ initialTransactionId, uid: userId });
    await expect(result).rejects.toThrow(SplitContractError.NotFound);
  });

  it('should get an error when no contract created', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));

    await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });
    const result = dependencies.getOneSplitContract.execute({ initialTransactionId, uid: userId });
    await expect(result).rejects.toThrow(SplitContractError.NotFound);
  });

  it('should return the credit details', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json', { before: nockBefore });
    const simulation = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      transactionDate: new Date('1994-04-21T00:00:00.000Z'),
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });
    const contract = await dependencies.createSplitContract.execute({
      simulationId: simulation[0].id,
      bankAccountId: 'tchatche',
    });

    const result = await dependencies.getOneSplitContract.execute({ initialTransactionId, uid: userId });
    expect(result).toEqual({
      userId: 'OsYFhvKAT',
      termsVersion: '20201111',
      status: 'IN_PROGRESS',
      initialTransactionId: 'a-9F3q0Ov',
      transactionDate: new Date('1994-04-21T00:00:00.000Z'),
      subscriptionDate: new Date('1994-04-21T00:00:00.000Z'),
      productCode: SplitProduct.DF003,
      apr: 0.1926,
      contractNumber: contract.contractNumber,
      paymentScheduleExecution: [
        {
          key: 'fee',
          amount: 5.79,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
          paymentDate: new Date('2020-10-23T08:24:03.652Z'),
          status: 'PAID',
          transactionId: 'ECCEDD22241',
        },
        {
          key: '001',
          amount: 133,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
          paymentDate: new Date('2020-10-23T08:24:07.544Z'),
          status: 'PAID',
          transactionId: 'ABCAAA20244',
        },
        {
          key: '002',
          amount: 133,
          dueDate: new Date('1994-05-21T00:00:00.000Z'),
          status: 'TODO',
        },
        {
          key: '003',
          amount: 133,
          dueDate: new Date('1994-06-21T00:00:00.000Z'),
          status: 'TODO',
        },
        {
          key: 'funding',
          amount: 399,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
          paymentDate: new Date('2020-10-23T08:23:59.630Z'),
          status: 'PAID',
          transactionId: 'CDCCAC03110',
        },
      ],
    });
    nockDone();
  });

  it('should throw a payment schedule not found error', async () => {
    const result = dependencies.splitPaymentScheduleRepository.getByContractNumber('azeazeaze');
    await expect(result).rejects.toThrow(SplitPaymentScheduleError.NotFound);
  });
});
