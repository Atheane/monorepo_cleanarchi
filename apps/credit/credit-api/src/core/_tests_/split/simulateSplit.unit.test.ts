import 'reflect-metadata';
import { SplitProduct } from '@oney/credit-messages';
import * as dateMock from 'jest-date-mock';
import { SplitSimulationError } from '@oney/credit-core';
import * as path from 'path';
import { getAppConfiguration } from '../../../config/app/AppConfigurationService';
import { DomainDependencies } from '../../di';
import { loadingEnvironmentConfig } from '../../../config/env/EnvConfigurationService';
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

describe('Split simulator unit testing - implementation inMemory', () => {
  let dependencies: DomainDependencies;
  const userId = 'OsYFhvKAT';
  const initialTransactionId = 'a-9F3q0Ov';
  // eslint-disable-next-line max-len
  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsiZW1haWwiOiJqYXJkaW4wOEB5b3BtYWlsLmNvbSIsInVpZCI6Ik9zWUZodktBVCJ9fSwiaWF0IjoxNjAwODkwNDQyLCJleHAiOjMyMDI1MTgwNDUsImF1ZCI6Im9kYl9hdXRoZW50aWNhdGlvbl9kZXYiLCJpc3MiOiJvZGJfYXV0aGVudGljYXRpb24ifQ.UPj2lelUeUfGHh5212yRcdJ19ywcjjLUiFSpdfvxj0Q';

  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);

    const configuration = getAppConfiguration();
    const kernel = await initializeKernel(true, configuration);
    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    dateMock.clear();
  });

  it('should generate simulation for a x3 loan', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });

    expect(result).toEqual([
      expect.objectContaining({
        label: 'mon super marchant',
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
      label: 'mon super marchant',
    });

    expect(result).toEqual([
      expect.objectContaining({
        label: 'mon super marchant',
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
        label: 'mon super marchant',
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
      label: 'mon super marchant',
    });

    expect(result).toEqual([
      expect.objectContaining({
        label: 'mon super marchant',
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
      label: 'mon super marchant',
    });

    expect(result).toEqual([
      expect.objectContaining({
        label: 'mon super marchant',
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
  it('should generate simulation for a x4 loan with not divisible amount', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 20.03,
      productsCode: [SplitProduct.DF004],
      label: 'mon super marchant',
    });

    expect(result).toEqual([
      expect.objectContaining({
        label: 'mon super marchant',
        initialTransactionId,
        userId,
        productCode: SplitProduct.DF004,
        fundingAmount: 20.03,
        fee: 0.44,
        apr: 0.1961,
        immediatePayments: [
          {
            key: 'fee',
            amount: 0.44,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
          {
            key: '001',
            amount: 5.01,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
          },
        ],
        deferredPayments: [
          {
            key: '002',
            amount: 5.01,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
          },
          {
            key: '003',
            amount: 5.01,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
          },
          {
            key: '004',
            amount: 5.0,
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
      label: 'mon super marchant',
    });

    expect(result).toEqual([
      expect.objectContaining({
        label: 'mon super marchant',
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

  it('should not generate anything if the product code is unknown', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const result = dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 1790,
      productsCode: ['xxx' as SplitProduct],
      label: 'mon super marchant',
    });

    await expect(result).rejects.toThrow(SplitSimulationError.UnkownSplitProduct);
  });

  it('Should return false', async () => {
    const result = await dependencies.checkUserId.execute({
      userId: 'BAD_ID_2',
      userToken,
    });
    expect(result).toEqual(false);
  });

  it('Should return true', async () => {
    const result = await dependencies.checkUserId.execute({
      userToken,
      userId,
    });
    expect(result).toEqual(true);
  });
});
