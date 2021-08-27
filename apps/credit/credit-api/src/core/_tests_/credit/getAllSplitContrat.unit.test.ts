import 'reflect-metadata';
import * as dateMock from 'jest-date-mock';
import { ContractStatus, PaymentStatus, ScheduleKey, SplitProduct } from '@oney/credit-messages';
import * as nock from 'nock';
import { SplitPaymentSchedule, SplitPaymentScheduleError } from '@oney/credit-core';
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
nockBack.setMode('record');

const nockBefore = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => ({
    ...JSON.parse(body),
    contractNumber: aRecordedBody.contractNumber,
  });
};

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Get all user split contracts unit testing - implementation inMemory', () => {
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

  it('should return an empty array when no user as no contract', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));

    const result = await dependencies.creditGetAllSplitContract.execute({
      status: [ContractStatus.IN_PROGRESS],
    });
    expect(result).toEqual([]);
  });

  it('should return a list of contracts', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json', {
      before: nockBefore,
    });
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
    const result = await dependencies.creditGetAllSplitContract.execute({});
    expect(result).toEqual([
      {
        userId: 'OsYFhvKAT',
        status: 'IN_PROGRESS',
        termsVersion: '20201111',
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
            status: PaymentStatus.PAID,
            transactionId: 'CDCCAC03110',
          },
        ],
      },
    ]);
    nockDone();
  });

  it('should get contract without paymentScheduleExecution when the status is paid', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
    const simulation = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      transactionDate: new Date('1994-04-21T00:00:00.000Z'),
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });
    const simulationProps = await dependencies.validateSplitSimulation.execute({
      simulationId: simulation[0].id,
    });

    const contract = {
      userId,
      bankAccountId: '9999',
      initialTransactionId: simulationProps.initialTransactionId,
      transactionDate: new Date('1994-04-21T00:00:00.000Z'),
      subscriptionDate: new Date('1994-04-21T00:00:00.000Z'),
      productCode: simulationProps.productCode,
      contractNumber: 'lalala',
      apr: simulationProps.apr,
      status: ContractStatus.PAID,
      initialPaymentSchedule: {
        immediatePayments: simulationProps.immediatePayments,
        deferredPayments: simulationProps.deferredPayments,
      },
      label: 'mon super marchant',
      termsVersion: '20201111',
      finalPaymentSchedule: new SplitPaymentSchedule({
        id: 'randomeId',
        userId,
        productCode: simulationProps.productCode,
        label: 'mon super marchant',
        contractNumber: 'lalala',
        status: ContractStatus.PAID,
        apr: 1.5087,
        bankAccountId: '9999',
        fundingExecution: {
          key: ScheduleKey.FUNDING,
          amount: 399,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
          paymentDate: new Date('2020-10-23T08:24:03.652Z'),
          status: PaymentStatus.PAID,
          transactionId: 'ECCEDD22240',
        },
        paymentsExecution: [
          {
            key: ScheduleKey.FEE,
            amount: 5.79,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
            paymentDate: new Date('2020-10-23T08:24:03.652Z'),
            status: PaymentStatus.PAID,
            transactionId: 'ECCEDD22241',
          },
          {
            key: ScheduleKey.M1,
            amount: 133,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
            paymentDate: new Date('2020-10-23T08:24:07.544Z'),
            status: PaymentStatus.PAID,
            transactionId: 'ABCAAA20244',
          },
          {
            key: ScheduleKey.M2,
            amount: 133,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
            paymentDate: new Date('2020-10-23T08:24:07.544Z'),
            status: PaymentStatus.PAID,
            transactionId: 'ABCAAA20244',
          },
          {
            key: ScheduleKey.M3,
            amount: 133,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
            paymentDate: new Date('2020-10-23T08:24:07.544Z'),
            status: PaymentStatus.PAID,
            transactionId: 'ABCAAA20244',
          },
        ],
      }),
    };

    await dependencies.splitContractRepository.save(contract);
    const result = await dependencies.creditGetAllSplitContract.execute({});
    expect(result).toEqual([
      {
        userId: 'OsYFhvKAT',
        status: 'PAID',
        termsVersion: '20201111',
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
            status: PaymentStatus.PAID,
            transactionId: 'ECCEDD22241',
          },
          {
            key: '001',
            amount: 133,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
            paymentDate: new Date('2020-10-23T08:24:07.544Z'),
            status: PaymentStatus.PAID,
            transactionId: 'ABCAAA20244',
          },
          {
            key: '002',
            amount: 133,
            dueDate: new Date('1994-05-21T00:00:00.000Z'),
            paymentDate: new Date('2020-10-23T08:24:07.544Z'),
            status: PaymentStatus.PAID,
            transactionId: 'ABCAAA20244',
          },
          {
            key: '003',
            amount: 133,
            dueDate: new Date('1994-06-21T00:00:00.000Z'),
            paymentDate: new Date('2020-10-23T08:24:07.544Z'),
            status: PaymentStatus.PAID,
            transactionId: 'ABCAAA20244',
          },
          {
            key: 'funding',
            amount: 399,
            dueDate: new Date('1994-04-21T00:00:00.000Z'),
            paymentDate: new Date('2020-10-23T08:24:03.652Z'),
            status: PaymentStatus.PAID,
            transactionId: 'ECCEDD22240',
          },
        ],
      },
    ]);
  });

  it('should throw a payment schedule not found error', async () => {
    const result = dependencies.splitPaymentScheduleRepository.getByContractNumber('azeazeaze');
    await expect(result).rejects.toThrow(SplitPaymentScheduleError.NotFound);
  });
});
