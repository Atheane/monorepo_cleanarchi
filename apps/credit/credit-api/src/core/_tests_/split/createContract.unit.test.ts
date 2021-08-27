import 'reflect-metadata';
import { ContractStatus, SplitProduct } from '@oney/credit-messages';
import * as dateMock from 'jest-date-mock';
import * as nock from 'nock';
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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures`);
nockBack.setMode('dryrun');

const nockBefore = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => ({
    ...JSON.parse(body),
    contractNumber: aRecordedBody.contractNumber,
  });
};

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Create contract unit testing - implementation inMemory', () => {
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
      }),
    );
    nockDone();
  });

  it('should create a split product for a x3 loan when the payment fail', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('failedPaymentToManyRequest.json');
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
      }),
    );
    nockDone();
  });

  it('should throw a split product not found error', async () => {
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

    expect(result1).toEqual(result2);
    nockDone();
  });

  it('should throw a simulation not found error if two simulation on two devices', async () => {
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json', { before: nockBefore });
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const simulation1 = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });

    const simulationProps1 = await dependencies.validateSplitSimulation.execute({
      simulationId: simulation1[0].id,
    });

    const simulation2 = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
    });

    const simulationProps2 = await dependencies.validateSplitSimulation.execute({
      simulationId: simulation2[0].id,
    });

    const result1 = dependencies.createSplitContract.execute({
      simulationId: simulationProps1.id,
      bankAccountId: 'tchatche',
    });

    const contract = await dependencies.createSplitContract.execute({
      simulationId: simulationProps2.id,
      bankAccountId: 'tchatche',
    });

    await expect(result1).rejects.toThrow(SplitSimulationError.NotFound);
    expect(contract).toEqual(
      expect.objectContaining({
        userId,
        initialTransactionId,
        productCode: SplitProduct.DF003,
        subscriptionDate: new Date('1994-04-21T00:00:00.000Z'),
        status: ContractStatus.IN_PROGRESS,
        initialPaymentSchedule: {
          immediatePayments: simulationProps2.immediatePayments,
          deferredPayments: simulationProps2.deferredPayments,
        },
      }),
    );
    nockDone();
  });
});
