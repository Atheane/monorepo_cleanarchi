import 'reflect-metadata';
import { initMongooseConnection } from '@oney/common-adapters';
import { ContractStatus, SplitProduct } from '@oney/credit-messages';
import * as dateMock from 'jest-date-mock';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import { SplitSimulationError, IAppConfiguration } from '@oney/credit-core';
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

const envPath = path.resolve(`${__dirname}/../env/test.env`);
const fixturesPath = path.resolve(`${__dirname}/../fixtures`);

const nockBack = nock.back;
nockBack.fixtures = fixturesPath;
nockBack.setMode('record');

const nockBefore = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => ({
    ...JSON.parse(body),
    contractNumber: aRecordedBody.contractNumber,
  });
};

describe('Create contract integration testing - implementation mongoDB', () => {
  let dependencies: DomainDependencies;
  let dbConnection: mongoose.Connection;
  let configuration: IAppConfiguration;
  const userId = 'OsYFhvKAT';
  const initialTransactionId = 'a-9F3q0Ov';

  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);

    dbConnection = await initMongooseConnection(process.env.MONGO_URL);
    configuration = getAppConfiguration();
    configuration.mongoDBConfiguration.odbCreditDbName = process.env.MONGO_DB_NAME;
    const kernel = await initializeKernel(false, configuration, dbConnection);
    dependencies = kernel.getDependencies();
  });

  afterEach(async () => {
    dateMock.clear();
    await getSplitContractModel().deleteMany({});
    await getSplitPaymentScheduleModel().deleteMany({});
    await getSplitSimulationModel().deleteMany({});
  });

  it('should create a contract for a x3 loan', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json', { before: nockBefore });
    const simulation = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });

    const simulationProps = await dependencies.validateSplitSimulation.execute({
      simulationId: simulation[0].id,
    });

    const contract = await dependencies.createSplitContract.execute({
      simulationId: simulationProps.id,
      bankAccountId: '1388',
    });

    expect(contract).toEqual(
      expect.objectContaining({
        userId,
        initialTransactionId,
        productCode: SplitProduct.DF003,
        subscriptionDate: new Date('1994-04-21T00:00:00.000Z'),
        status: ContractStatus.IN_PROGRESS,
        initialPaymentSchedule: {
          immediatePayments: simulationProps.immediatePayments,
          deferredPayments: simulationProps.deferredPayments,
        },
        termsVersion: '20201111',
      }),
    );

    const result = await dependencies.splitPaymentScheduleRepository.getByContractNumber(
      contract.contractNumber,
    );

    expect(result.fundingExecution).toEqual({
      key: 'funding',
      amount: 399,
      dueDate: new Date('1994-04-21T00:00:00.000Z'),
      paymentDate: new Date('2020-10-23T08:23:59.630Z'),
      status: 'PAID',
      transactionId: 'CDCCAC03110',
    });
    expect(result.paymentsExecution).toEqual([
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
    ]);
    nockDone();
  });

  it('should throw a simulation not found error', async () => {
    const result = dependencies.createSplitContract.execute({
      simulationId: 'nimp',
      bankAccountId: 'tchatche',
    });
    await expect(result).rejects.toThrow(SplitSimulationError.NotFound);
  });

  it('should return the same contract if endpoint is called twice', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json', { before: nockBefore });
    const simulation = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });

    const simulationProps = await dependencies.validateSplitSimulation.execute({
      simulationId: simulation[0].id,
    });

    const result1 = await dependencies.createSplitContract.execute({
      simulationId: simulationProps.id,
      bankAccountId: 'tchatche',
    });

    const result2 = await dependencies.createSplitContract.execute({
      simulationId: simulationProps.id,
      bankAccountId: 'tchatche',
    });

    expect(result1.contractNumber).toEqual(result2.contractNumber);
    nockDone();
  });

  it('should fail payment execution', async () => {
    const { nockDone } = await nockBack('failPaymentSchedule.json', { before: nockBefore });
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const simulation = await dependencies.simulateSplit.execute({
      userId: 'BAD_ID_1',
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });

    const simulationProps = await dependencies.validateSplitSimulation.execute({
      simulationId: simulation[0].id,
    });

    const createdContract = await dependencies.createSplitContract.execute({
      simulationId: simulationProps.id,
      bankAccountId: 'tchatche',
    });

    const result = await dependencies.splitPaymentScheduleRepository.getByContractNumber(
      createdContract.contractNumber,
    );

    expect(result.fundingExecution).toEqual({
      key: 'funding',
      amount: 399,
      dueDate: new Date('1994-04-21T00:00:00.000Z'),
      status: 'TODO',
    });
    expect(result.paymentsExecution).toEqual([
      {
        key: 'fee',
        amount: 5.79,
        dueDate: new Date('1994-04-21T00:00:00.000Z'),
        status: 'TODO',
      },
      {
        key: '001',
        amount: 133,
        dueDate: new Date('1994-04-21T00:00:00.000Z'),
        status: 'TODO',
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
    ]);

    nockDone();
  });
});
