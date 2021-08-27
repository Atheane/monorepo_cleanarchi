import {
  BankAccount,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  CollectDebt,
  Debt,
  DebtProperties,
  DebtStatus,
  PaymentIdentifier,
} from '@oney/payment-core';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import { AllDebtsFullyCollected } from '@oney/payment-messages';
import * as path from 'path';
import {
  basicBankAccountPropertiesMocked,
  expectedOldestPartialDebtFirstCollection,
  expectedOldestPartialDebtSecondCollection,
  getBasicBankAccountWithDebtsMockedInDB,
  middleDatedDebt,
  newestDebtMocked,
  oldesDebttMocked,
  PayedDebt,
} from './fixtures/collectDebt/bankAccountFixture';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { PaymentKernel } from '../di/PaymentKernel';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/collectDebt`);
nockBack.setMode('record');

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

describe('CollectDebt usecase', () => {
  let saveFixture: Function;
  let kernel: PaymentKernel;
  let debtCollect: CollectDebt;

  beforeAll(async () => {
    const { nockDone } = await nock.back('getAccessToken.json');
    kernel = await initializePaymentKernel({
      useAzure: true,
      useDbInMemory: false,
      mongoUri: process.env.MONGO_URL,
    });
    await kernel.initSubscribers();

    nockDone();
    debtCollect = kernel.get(CollectDebt);
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
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
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
    jest.clearAllMocks();
  });

  it('should recover all debts when debt amount is covered', async () => {
    const { props } = getBasicBankAccountWithDebtsMockedInDB();
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(getBasicBankAccountWithDebtsMockedInDB());

    await debtCollect.execute({ uid: props.uid, amount: 130 });

    const {
      props: { debts },
    } = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(props.uid);

    const expectedAllDebtsWereCollected = debts.every(debt => debt.isClosed());
    const hasCollectionsFilled = debts.every(debt => debt.props.collections.length === 1);

    expect(expectedAllDebtsWereCollected).toBe(true);
    expect(hasCollectionsFilled).toBe(true);
  });

  it('should paid unpaid debts from OLRDER to NEWEST', async () => {
    const spyOnCollectDebt = jest.spyOn(BankAccount.prototype, 'collectDebt');
    const bankAccountToSaveInDB = getBasicBankAccountWithDebtsMockedInDB();
    const { uid } = bankAccountToSaveInDB.props;
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(bankAccountToSaveInDB);

    await debtCollect.execute({ uid, amount: 130 });

    expect(spyOnCollectDebt).toHaveBeenCalledTimes(3);
    expect(spyOnCollectDebt.mock.calls[PayedDebt.FIRST][1].props.amount).toBe(oldesDebttMocked.debtAmount);
    expect(spyOnCollectDebt.mock.calls[PayedDebt.SECOND][1].props.amount).toBe(middleDatedDebt.debtAmount);
    expect(spyOnCollectDebt.mock.calls[PayedDebt.THRID][1].props.amount).toBe(newestDebtMocked.debtAmount);
  });

  it(`should be able to partially collect debt`, async () => {
    const spyOnCollectDebt = jest.spyOn(BankAccount.prototype, 'collectDebt');
    const {
      props: { uid },
    } = getBasicBankAccountWithDebtsMockedInDB();
    const debt: DebtProperties = { ...oldesDebttMocked, debtAmount: 100, remainingDebtAmount: 100 };
    const bankAccount = new BankAccount({
      ...basicBankAccountPropertiesMocked,
      debts: [new Debt(debt)],
    });
    const expectedRemainingDebtAmountAfter2Collects = debt.debtAmount - (20 + 30);
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(bankAccount);

    await debtCollect.execute({ uid, amount: 20 });
    await debtCollect.execute({ uid, amount: 30 });

    const {
      props: { debts },
    } = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(bankAccount.props.uid);

    expect(spyOnCollectDebt).toHaveBeenCalledTimes(2);
    expect(debts[0].props.remainingDebtAmount).toBe(expectedRemainingDebtAmountAfter2Collects);
    expect(debts[0].props.collections[0].props).toMatchObject(expectedOldestPartialDebtFirstCollection);
    expect(debts[0].props.collections[1].props).toMatchObject(expectedOldestPartialDebtSecondCollection);
  });

  it(`should fully paid 1st debt and keep 2nd debt unpaided (remaining 10)`, async () => {
    const spyOnCollectDebt = jest.spyOn(BankAccount.prototype, 'collectDebt');
    const {
      props: { uid },
    } = getBasicBankAccountWithDebtsMockedInDB();
    const debt: DebtProperties = { ...oldesDebttMocked, debtAmount: 100, remainingDebtAmount: 100 };
    const bankAccount = new BankAccount({
      ...basicBankAccountPropertiesMocked,
      debts: [new Debt(debt), new Debt(newestDebtMocked)],
    });
    const expectedRemainingDebtAmountAfter2Collects = debt.debtAmount - (50 + 50);
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(bankAccount);

    await debtCollect.execute({ uid, amount: 50 });
    await debtCollect.execute({ uid, amount: 60 });

    const {
      props: { debts },
    } = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(bankAccount.props.uid);

    expect(spyOnCollectDebt).toHaveBeenCalledTimes(3);
    expect(debts[0].props.remainingDebtAmount).toBe(expectedRemainingDebtAmountAfter2Collects);
    expect(debts[1].props.status).toBe(DebtStatus.PENDING);
    expect(debts[1].props.remainingDebtAmount).toBe(10);
  });

  it('should dispatch event ALL_DEBTS_FULLY_PAID when all debts are paid', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventDispatcher), 'dispatch');
    const { uid } = getBasicBankAccountWithDebtsMockedInDB().props;
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(getBasicBankAccountWithDebtsMockedInDB());
    const allDebtsFullyCollectedEvent = { props: { uid } } as AllDebtsFullyCollected;

    await debtCollect.execute({ uid, amount: 130 });

    expect(eventDispatcherSpy).toHaveBeenCalledWith(expect.objectContaining(allDebtsFullyCollectedEvent));
  });
});
