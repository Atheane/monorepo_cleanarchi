import 'reflect-metadata';
import {
  BankAccount,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  CalculateBankAccountExposure,
  UpdateMonthlyAllowance,
} from '@oney/payment-core';
import * as nock from 'nock';
import { ClassType } from '@oney/common-core';
import { defaultLogger } from '@oney/logger-adapters';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedBankAccount } from './fixtures/transactions/mockedBankAccount';
import {
  cardTransacReceived,
  clearingReceived,
  p2pExecuted,
  sctOutExecuted,
} from './fixtures/transactions/newTransacDomainEvents';
import { mockedLimitsSuccess } from './fixtures/transactions/smoneyMockedResponse';
import { CardTransactionReceivedEventHandler } from '../adapters/handlers/transaction/CardTransactionReceivedEventHandler';
import { ClearingReceivedEventHandler } from '../adapters/handlers/transaction/ClearingReceivedEventHandler';
import { PaymentCreatedEventHandler } from '../adapters/handlers/transaction/PaymentCreatedEventHandler';
import { SctOutExecutedEventHandler } from '../adapters/handlers/transaction/SctOutExecutedEventHandler';
import { PaymentKernel } from '../di/PaymentKernel';

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

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        listBlobsFlat: jest.fn().mockReturnValue([
          {
            name: 'kyc/toto.jpg',
          },
        ]),
        getBlobClient: jest.fn().mockReturnValue({
          download: jest.fn().mockReturnValue({
            readableStreamBody: new Uint8Array(naruto[0] as any),
          }),
        }),
      }),
    }),
  },
}));

const smoneyScope = nock('https://sb-api.xpollens.com/api/V1.1');

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyCards`);

describe('Unit test suite for Transaction Received Handler', () => {
  let kernel: PaymentKernel;
  let bankAccount: BankAccount;

  const awaitedRemainingToSpend =
    Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100) -
    Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyUsedAllowance / 100);

  const disablingUsecaseExecutionDuringHandler = <T>(usecase: ClassType<T>) =>
    (usecase.prototype.execute = jest.fn());

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    await kernel.initSubscribers();
    nockDone();
  });

  beforeEach(async () => {
    bankAccount = await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccount);
  });

  afterEach(async () => {
    smoneyScope.done();
  });

  afterAll(() => {
    jest.clearAllMocks();
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should save an updated bank account because new card transaction received', async () => {
    disablingUsecaseExecutionDuringHandler<CalculateBankAccountExposure>(CalculateBankAccountExposure);
    smoneyScope.get('/users/kTDhDRrHv/limits').reply(200, mockedLimitsSuccess);
    await new CardTransactionReceivedEventHandler(
      kernel.get(UpdateMonthlyAllowance),
      kernel.get(PaymentIdentifier.notifyUpdateBankAccount),
      kernel.get(CalculateBankAccountExposure),
      defaultLogger,
    ).handle({
      id: 'oapzekozae',
      props: cardTransacReceived,
    });

    const updatedBankAccount = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(cardTransacReceived.details.AccountId.AppAccountId);

    expect(200);
    expect(updatedBankAccount.props).toEqual({
      ...bankAccount.props,
      monthlyAllowance: {
        remainingFundToSpend: awaitedRemainingToSpend,
        authorizedAllowance: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100),
        spentFunds: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100) - awaitedRemainingToSpend,
      },
    });
  });

  it('Should save an updated bank account because new clearing received', async () => {
    disablingUsecaseExecutionDuringHandler<CalculateBankAccountExposure>(CalculateBankAccountExposure);
    smoneyScope.get('/users/kTDhDRrHv/limits').reply(200, mockedLimitsSuccess);
    await new ClearingReceivedEventHandler(
      kernel.get(UpdateMonthlyAllowance),
      kernel.get(PaymentIdentifier.notifyUpdateBankAccount),
      kernel.get(CalculateBankAccountExposure),
      defaultLogger,
    ).handle({
      id: 'ijazoejz',
      props: clearingReceived,
    });

    const updatedBankAccount = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(cardTransacReceived.details.AccountId.AppAccountId);

    expect(200);
    expect(updatedBankAccount.props).toEqual({
      ...bankAccount.props,
      monthlyAllowance: {
        remainingFundToSpend: awaitedRemainingToSpend,
        authorizedAllowance: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100),
        spentFunds: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100) - awaitedRemainingToSpend,
      },
    });
  });

  it('Should save an updated bank account because new sct out executed', async () => {
    disablingUsecaseExecutionDuringHandler<CalculateBankAccountExposure>(CalculateBankAccountExposure);
    smoneyScope.get('/users/kTDhDRrHv/limits').reply(200, mockedLimitsSuccess);
    await new SctOutExecutedEventHandler(
      kernel.get(UpdateMonthlyAllowance),
      kernel.get(PaymentIdentifier.notifyUpdateBankAccount),
      kernel.get(CalculateBankAccountExposure),
      defaultLogger,
    ).handle({
      id: 'azipeoazek',
      props: sctOutExecuted,
    });

    const updatedBankAccount = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(cardTransacReceived.details.AccountId.AppAccountId);

    expect(200);
    expect(updatedBankAccount.props).toEqual({
      ...bankAccount.props,
      monthlyAllowance: {
        remainingFundToSpend: awaitedRemainingToSpend,
        authorizedAllowance: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100),
        spentFunds: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100) - awaitedRemainingToSpend,
      },
    });
  });

  it('Should save an updated bank account because new P2P created', async () => {
    disablingUsecaseExecutionDuringHandler<CalculateBankAccountExposure>(CalculateBankAccountExposure);
    smoneyScope.get('/users/kTDhDRrHv/limits').reply(200, mockedLimitsSuccess);
    await new PaymentCreatedEventHandler(
      kernel.get(UpdateMonthlyAllowance),
      kernel.get(PaymentIdentifier.notifyUpdateBankAccount),
      kernel.get(CalculateBankAccountExposure),
      defaultLogger,
    ).handle({
      id: 'poazkeozae',
      props: p2pExecuted,
    } as any);

    const updatedBankAccount = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(cardTransacReceived.details.AccountId.AppAccountId);

    expect(200);
    expect(updatedBankAccount.props).toEqual({
      ...bankAccount.props,
      monthlyAllowance: {
        remainingFundToSpend: awaitedRemainingToSpend,
        authorizedAllowance: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100),
        spentFunds: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100) - awaitedRemainingToSpend,
      },
    });
  });
});
