import {
  BankAccount,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  UpdateTechnicalLimit,
  UpdateTechnicalLimitCommandSplitContract,
} from '@oney/payment-core';
import MockDate from 'mockdate';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import * as path from 'path';
import 'reflect-metadata';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';
import {
  bankAccountBasicPropertiesNotTechnicalLimitYet,
  mockedBankAccountUpateLimits,
} from './fixtures/updateGlobalOutLimits/BankAccountMocked';
import { PaymentKernel } from '../di/PaymentKernel';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/updateTechnicalLimit`);
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
          download: jest.fn(),
        }),
      }),
    }),
  },
}));

describe('UpdateTechnicalLimit usecase', () => {
  let saveFixture: Function;
  let updateTechnicalLimit: UpdateTechnicalLimit;
  let kernel: PaymentKernel;

  beforeAll(async () => {
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({
      useAzure: true,
      useDbInMemory: false,
      mongoUri: process.env.MONGO_URL,
    });

    nockDone();
    updateTechnicalLimit = kernel.get(UpdateTechnicalLimit);
  });
  beforeEach(async () => {
    MockDate.set(new Date('2021-04-21T00:00:00.000Z'));
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
  });

  afterAll(() => {
    jest.clearAllMocks();
    nock.cleanAll();
    MockDate.reset();
  });

  it('should update limits when account has monthly global out limit', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccountUpateLimits);
    const uid = mockedBankAccount.props.uid;

    await updateTechnicalLimit.execute({ uid });

    const expectedTechnicalLimit = 1930;
    const bankAccountUpdated = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(uid);
    expect(bankAccountUpdated.getTechnicalLimit()).toBe(expectedTechnicalLimit);
  });

  it('Should update when split contract was created AND the account had technical limit', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccountUpateLimits);

    const uid = mockedBankAccount.props.uid;
    const contract: UpdateTechnicalLimitCommandSplitContract = {
      fees: 2,
      firstPayment: 25,
      funding: 100,
    };

    await updateTechnicalLimit.execute({ uid, useContract: true, contract });

    const expectedTechnicalLimit = 2073;
    const bankAccountUpdated = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(uid);
    expect(bankAccountUpdated.getTechnicalLimit()).toBe(expectedTechnicalLimit);
  });

  it('should update when split contract was created BUT the account hadnt technical limit', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(new BankAccount(bankAccountBasicPropertiesNotTechnicalLimitYet));
    const uid = mockedBankAccount.props.uid;
    const contract: UpdateTechnicalLimitCommandSplitContract = {
      fees: 2,
      firstPayment: 25,
      funding: 100,
    };

    await updateTechnicalLimit.execute({ uid, useContract: true, contract });

    const expectedTechnicalLimit = 2430;
    const bankAccountUpdated = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(uid);
    expect(bankAccountUpdated.getTechnicalLimit()).toBe(expectedTechnicalLimit);
  });
});
