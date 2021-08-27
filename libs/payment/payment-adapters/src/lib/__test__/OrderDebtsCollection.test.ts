import {
  BankAccountError,
  BankAccountRepositoryWrite,
  OrderDebtsCollection,
  OrderDebtsCollectionCommand,
  PaymentIdentifier,
  SyncAccountDebts,
} from '@oney/payment-core';
import * as mongoose from 'mongoose';
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import * as nock from 'nock';
import * as path from 'path';
import {
  bankAccountWithDebtsMocked,
  basicBankAccountMocked,
} from './fixtures/bankAccount/bankAccountFixture';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { PaymentKernel } from '../di/PaymentKernel';

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

describe('OrderDebtsCollections usecase', () => {
  let kernel: PaymentKernel;
  let orderDebtCollection: OrderDebtsCollection;

  beforeAll(async () => {
    nock.cleanAll();

    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/debtsCollec`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    await kernel.initSubscribers();

    orderDebtCollection = kernel.get(OrderDebtsCollection);
    nockDone();
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should dispatch a debt collection order when bank account exist and it has unpaid debts', async () => {
    SyncAccountDebts.prototype.execute = jest.fn();
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventDispatcher), 'dispatch');
    const { props } = await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(bankAccountWithDebtsMocked);
    const amountToUseInDebtsCollectionProcess = 100;
    const expectedEventProps: OrderDebtsCollectionCommand = {
      amount: amountToUseInDebtsCollectionProcess,
      uid: props.uid,
    };
    const expectedDebtRecoveryOrderedEventMessage = {
      props: expectedEventProps,
    };

    await orderDebtCollection.execute({ uid: props.uid, amount: amountToUseInDebtsCollectionProcess });

    expect(eventDispatcherSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedDebtRecoveryOrderedEventMessage),
    );
  });

  it('should throw error: BankAccountNotFound, when bank account is not found', async () => {
    const amountToUseInDebtsCollectionProcess = 100;
    const uidNotFound = 'userIdNotFound';

    const tryDebtCollectionUsecaseThatShouldThrow = orderDebtCollection.execute({
      uid: uidNotFound,
      amount: amountToUseInDebtsCollectionProcess,
    });

    await expect(tryDebtCollectionUsecaseThatShouldThrow).rejects.toThrow(
      BankAccountError.BankAccountNotFound,
    );
  });

  it('should dispatch any collection order when bankaccount has any unpaid debt', async () => {
    SyncAccountDebts.prototype.execute = jest.fn();
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventDispatcher), 'dispatch');
    const { props } = await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(basicBankAccountMocked);
    const amountToUseInDebtsCollectionProcess = 100;
    const ANY_EVENT_DISPATCHED = 0;

    await orderDebtCollection.execute({ uid: props.uid, amount: amountToUseInDebtsCollectionProcess });

    expect(eventDispatcherSpy).toHaveBeenCalledTimes(ANY_EVENT_DISPATCHED);
  });

  it('should synchronize debts with partner before has unpaid checking', async () => {
    const SyncAccountDebtsUsecaseSpy = (SyncAccountDebts.prototype.execute = jest.fn());
    const { props } = await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(basicBankAccountMocked);
    const amountToUseInDebtsCollectionProcess = 100;

    const expectedSyncAccountDebtsUsecaseParams = props.uid;

    await orderDebtCollection.execute({ uid: props.uid, amount: amountToUseInDebtsCollectionProcess });

    expect(SyncAccountDebtsUsecaseSpy).toBeCalledWith(expectedSyncAccountDebtsUsecaseParams);
  });
});
