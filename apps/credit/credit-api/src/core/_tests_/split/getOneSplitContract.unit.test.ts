import 'reflect-metadata';
import { ContractStatus, PaymentStatus, ScheduleKey, SplitProduct } from '@oney/credit-messages';
import * as dateMock from 'jest-date-mock';
import * as nock from 'nock';
import {
  SplitPaymentSchedule,
  SplitContractError,
  SplitPaymentScheduleError,
  IAppConfiguration,
} from '@oney/credit-core';
import { Authorization, IdentityProvider, Permission, Scope, ServiceName } from '@oney/identity-core';
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

const nockBefore = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => ({
    ...JSON.parse(body),
    contractNumber: aRecordedBody.contractNumber,
  });
};

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Get split contract unit testing - implementation inMemory', () => {
  let dependencies: DomainDependencies;
  let configuration: IAppConfiguration;
  const userId = 'OsYFhvKAT';
  const initialTransactionId = 'a-9F3q0Ov';

  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);

    configuration = getAppConfiguration();
    configuration.mongoDBConfiguration.odbCreditDbName = process.env.MONGO_DB_NAME;

    const kernel = await initializeKernel(true, configuration);
    dependencies = kernel.getDependencies();
    nockBack.fixtures = path.resolve(`${__dirname}/../fixtures`);
  });

  beforeEach(() => {
    dateMock.clear();
    nockBack.setMode('record');
  });

  afterAll(async () => {
    nock.restore();
  });

  afterEach(() => {
    nock.back.setMode('wild');
    nock.cleanAll();
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
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json', {
      before: nockBefore,
    });
    const simulation = await dependencies.simulateSplit.execute({
      userId,
      initialTransactionId,
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });
    const contract = await dependencies.createSplitContract.execute({
      simulationId: simulation[0].id,
      bankAccountId: 'tchatche',
    });
    const result = await dependencies.getOneSplitContract.execute({
      initialTransactionId,
      uid: userId,
    });
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

  it('should get contract without paymentScheduleExecution when a contract created but no paymentSchedule exist', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
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

    const contract = {
      userId,
      bankAccountId: '9999',
      initialTransactionId: simulationProps.initialTransactionId,
      transactionDate: new Date('1994-04-21T00:00:00.000Z'),
      productCode: simulationProps.productCode,
      contractNumber: 'lalala',
      apr: simulationProps.apr,
      subscriptionDate: new Date(),
      status: ContractStatus.IN_PROGRESS,
      initialPaymentSchedule: {
        immediatePayments: simulationProps.immediatePayments,
        deferredPayments: simulationProps.deferredPayments,
      },
      label: 'mon super marchant',
      termsVersion: '20201111',
    };

    await dependencies.splitContractRepository.save(contract);
    const result = await dependencies.getOneSplitContract.execute({
      initialTransactionId: simulationProps.initialTransactionId,
      uid: userId,
    });
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
    });
  });

  it('should get contract without paymentScheduleExecution when the status is paid', async () => {
    dateMock.advanceTo(new Date('1994-04-21T00:00:00.000Z'));
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

    const contract = {
      userId,
      bankAccountId: '9999',
      initialTransactionId: simulationProps.initialTransactionId,
      transactionDate: new Date('1994-04-21T00:00:00.000Z'),
      productCode: simulationProps.productCode,
      contractNumber: 'lalala',
      apr: simulationProps.apr,
      subscriptionDate: new Date(),
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
          key: 'funding',
          amount: 399,
          dueDate: new Date('1994-04-21T00:00:00.000Z'),
          paymentDate: new Date('2020-10-23T08:23:59.630Z'),
          status: PaymentStatus.PAID,
          transactionId: 'CDCCAC03110',
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
    const result = await dependencies.getOneSplitContract.execute({
      initialTransactionId: simulationProps.initialTransactionId,
      uid: userId,
    });
    expect(result).toEqual({
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
          paymentDate: new Date('2020-10-23T08:23:59.630Z'),
          status: 'PAID',
          transactionId: 'CDCCAC03110',
        },
      ],
    });
  });

  it('should return true when token azure with permissions.read=all', async () => {
    const identity = {
      uid: '123456',
      name: 'oney_compta',
      provider: IdentityProvider.azure,
      roles: [
        {
          scope: new Scope({
            name: ServiceName.credit,
          }),
          permissions: new Permission({
            write: Authorization.denied,
            read: Authorization.all,
          }),
        },
      ],
    };
    const isAuthorize = await dependencies.getOneSplitContract.canExecute(identity, {
      initialTransactionId,
      uid: userId,
    });

    expect(isAuthorize).toEqual(true);
  });

  it('should return true when token azure with permissions.read=self', async () => {
    const identity = {
      name: 'user',
      uid: userId,
      roles: [
        {
          scope: new Scope({
            name: ServiceName.credit,
          }),
          permissions: new Permission({
            write: Authorization.self,
            read: Authorization.self,
          }),
        },
      ],
      provider: IdentityProvider.odb,
    };
    const isAuthorize = await dependencies.getOneSplitContract.canExecute(identity, {
      initialTransactionId,
      uid: userId,
    });

    expect(isAuthorize).toEqual(true);
  });

  it('should return false when token ad with no credit permissions', async () => {
    const identity = {
      uid: '123456',
      name: 'oney_compta',
      provider: IdentityProvider.azure,
      roles: [],
    };
    const isAuthorize = await dependencies.getOneSplitContract.canExecute(identity, {
      initialTransactionId,
      uid: userId,
    });

    expect(isAuthorize).toEqual(false);
  });
});
