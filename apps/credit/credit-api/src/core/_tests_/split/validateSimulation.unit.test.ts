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

describe('Validate simulation unit testing - implementation inMemory', () => {
  const userId = 'OsYFhvKAT';
  let dependencies: DomainDependencies;
  let initialTransactionId: string;
  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);

    const configuration = getAppConfiguration();
    const kernel = await initializeKernel(true, configuration);
    dependencies = kernel.getDependencies();
    initialTransactionId = 'a-9F3q0Ov';
  });

  beforeEach(async () => {
    dateMock.clear();
  });

  it('should create a split product for a x3 loan', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const simulation = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });

    const result = await dependencies.validateSplitSimulation.execute({
      simulationId: simulation[0].id,
    });

    expect(result).toEqual(
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
    );
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
    });

    const result = dependencies.validateSplitSimulation.execute({
      simulationId: simulation1[0].id,
    });

    await expect(result).rejects.toThrow(SplitSimulationError.NotFound);
  });
});
