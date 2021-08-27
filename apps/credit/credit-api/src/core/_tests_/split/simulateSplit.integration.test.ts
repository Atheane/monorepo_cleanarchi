import 'reflect-metadata';
import { initMongooseConnection } from '@oney/common-adapters';
import { SplitProduct } from '@oney/credit-messages';
import * as dateMock from 'jest-date-mock';
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

describe('Split simulator integration testing - implementation mongoDB', () => {
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

  it('should generate simulation for a x3 loan', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
    });

    expect(result).toEqual([
      expect.objectContaining({
        initialTransactionId,
        userId,
        productCode: SplitProduct.DF003,
        fundingAmount: 399,
        fee: 5.79,
        apr: 0.1926,
        immediatePayments: [
          {
            key: 'fee',
            amount: 5.79,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
          {
            key: '001',
            amount: 133,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
        ],
        deferredPayments: [
          {
            key: '002',
            amount: 133,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
          },
          {
            key: '003',
            amount: 133,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
          },
        ],
      }),
    ]);
  });

  it('should generate simulation for a x3 loan and x4 loan', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003, SplitProduct.DF004],
    });

    expect(result).toEqual([
      expect.objectContaining({
        initialTransactionId,
        userId,
        productCode: SplitProduct.DF003,
        fundingAmount: 399,
        fee: 5.79,
        apr: 0.1926,
        immediatePayments: [
          {
            key: 'fee',
            amount: 5.79,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
          {
            key: '001',
            amount: 133,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
        ],
        deferredPayments: [
          {
            key: '002',
            amount: 133,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
          },
          {
            key: '003',
            amount: 133,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
          },
        ],
      }),
      expect.objectContaining({
        initialTransactionId,
        userId,
        productCode: SplitProduct.DF004,
        fundingAmount: 399,
        fee: 8.78,
        apr: 0.1961,
        immediatePayments: [
          {
            key: 'fee',
            amount: 8.78,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
          {
            key: '001',
            amount: 99.75,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
        ],
        deferredPayments: [
          {
            key: '002',
            amount: 99.75,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
          },
          {
            key: '003',
            amount: 99.75,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
          },
          {
            key: '004',
            amount: 99.75,
            dueDate: new Date('1994-07-21T00:00:00.000Z'),
          },
        ],
      }),
    ]);
  });

  it('should generate simulation for a x3 loan where the fee threshold is reached', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 1790,
      productsCode: [SplitProduct.DF003],
    });

    expect(result).toEqual([
      expect.objectContaining({
        initialTransactionId,
        userId,
        productCode: SplitProduct.DF003,
        fundingAmount: 1790,
        fee: 10,
        apr: 0.0697,
        immediatePayments: [
          {
            key: 'fee',
            amount: 10.0,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
          {
            key: '001',
            amount: 596.67,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
        ],
        deferredPayments: [
          {
            key: '002',
            amount: 596.67,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
          },
          {
            key: '003',
            amount: 596.66,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
          },
        ],
      }),
    ]);
  });

  it('should generate simulation for a x4 loan', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF004],
    });

    expect(result).toEqual([
      expect.objectContaining({
        initialTransactionId,
        userId,
        productCode: SplitProduct.DF004,
        fundingAmount: 399,
        fee: 8.78,
        apr: 0.1961,
        immediatePayments: [
          {
            key: 'fee',
            amount: 8.78,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
          {
            key: '001',
            amount: 99.75,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
        ],
        deferredPayments: [
          {
            key: '002',
            amount: 99.75,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
          },
          {
            key: '003',
            amount: 99.75,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
          },
          {
            key: '004',
            amount: 99.75,
            dueDate: new Date('1994-07-21T00:00:00.000Z'),
          },
        ],
      }),
    ]);
  });

  it('should generate simulation for a x4 loan where the fee threshold is reached', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 1790,
      productsCode: [SplitProduct.DF004],
    });

    expect(result).toEqual([
      expect.objectContaining({
        initialTransactionId,
        userId,
        productCode: SplitProduct.DF004,
        fundingAmount: 1790,
        fee: 30,
        apr: 0.1454,
        immediatePayments: [
          {
            key: 'fee',
            amount: 30,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
          {
            key: '001',
            amount: 447.5,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
        ],
        deferredPayments: [
          {
            key: '002',
            amount: 447.5,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
          },
          {
            key: '003',
            amount: 447.5,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
          },
          {
            key: '004',
            amount: 447.5,
            dueDate: new Date('1994-07-21T00:00:00.000Z'),
          },
        ],
      }),
    ]);
  });
});
