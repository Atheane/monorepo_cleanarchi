import { EventDispatcher } from '@oney/messages-core';
import {
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  SyncAccountDebts,
} from '@oney/payment-core';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import * as path from 'path';
import 'reflect-metadata';
import { PaymentKernel } from '../di/PaymentKernel';
import {
  bankAccountWithDebtsMocked,
  basicBankAccountMocked,
} from './fixtures/bankAccount/bankAccountFixture';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { debtsFromSmoney } from './fixtures/syncAccountDebts/syncAccountDebts.fixture';

nock.enableNetConnect();

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
        getBlobClient: jest.fn().mockReturnValue({}),
      }),
    }),
  },
}));

describe('SyncAccountDebts usecase', () => {
  let saveFixture: Function;
  let kernel: PaymentKernel;
  let syncAccountDebts: SyncAccountDebts;

  beforeAll(async () => {
    nock.cleanAll();

    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/syncAccountDebts`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({
      useAzure: true,
      useDbInMemory: false,
      mongoUri: process.env.MONGO_URL,
    });

    await kernel.initSubscribers();

    syncAccountDebts = kernel.get(SyncAccountDebts);
    nockDone();
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    jest.clearAllMocks();

    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });
  afterEach(async () => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }

    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    jest.clearAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
    jest.clearAllMocks();
  });

  it('shoud create new debts when smo has debts not registed in odb', async () => {
    const { props } = await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(basicBankAccountMocked);
    const expectedCreatedDebts = debtsFromSmoney;
    const expectedNumberOfDebt = 2;

    await syncAccountDebts.execute(props.uid);

    const bankAccount = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(basicBankAccountMocked.props.uid);
    //expect debts mocked exist in array when we call bankAccount.read arraay

    const bankAccountDebts = bankAccount.props.debts;

    expect(bankAccountDebts.length).toBe(expectedNumberOfDebt);
    expect(bankAccountDebts).toEqual(expect.arrayContaining(expectedCreatedDebts));
  });

  it('shoud dispatch n events when n debts were created', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventDispatcher), 'dispatch');
    const { props } = await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(basicBankAccountMocked);
    const expectedNumberOfDebtCreations = 2;

    await syncAccountDebts.execute(props.uid);

    expect(eventDispatcherSpy).toHaveBeenCalledTimes(expectedNumberOfDebtCreations - 1);
  });

  it("should_not_create_or_update_any_debt_when_smo_doesn't_have_new_debts", async () => {
    const { props } = await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(bankAccountWithDebtsMocked);

    await syncAccountDebts.execute(props.uid);

    const bankAccount = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(basicBankAccountMocked.props.uid);

    const bankAccountDebts = bankAccount.props.debts;

    expect(bankAccountDebts.length).toEqual(1);
    expect(bankAccountDebts).toEqual(expect.arrayContaining(bankAccountWithDebtsMocked.props.debts));
  });

  it('should not dispatch events when any debt were created', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventDispatcher), 'dispatch');
    const { props } = await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(bankAccountWithDebtsMocked);

    await syncAccountDebts.execute(props.uid);

    expect(eventDispatcherSpy).toHaveBeenCalledTimes(0);
  });
});
