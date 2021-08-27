import { BankAccountRepositoryWrite, BatchUpdateTechnicalLimit, PaymentIdentifier } from '@oney/payment-core';
import MockDate from 'mockdate';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import * as path from 'path';
import 'reflect-metadata';
import {
  bankAccountBasicProperties,
  bankAccountBasicPropertiesSecond,
  bankAccountBasicPropertiesThrid,
  batchUpdateTechnicalUsers,
} from './fixtures/batchUpdateTechnicalLimit/BankAccountMocked';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
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

describe('BatchUpdateTechnicalLimit usecase', () => {
  let saveFixture: Function;
  let batchUpdateTechnicalLimit: BatchUpdateTechnicalLimit;
  let kernel: PaymentKernel;

  beforeAll(async () => {
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({
      useAzure: true,
      useDbInMemory: false,
      mongoUri: process.env.MONGO_URL,
    });

    nockDone();
    batchUpdateTechnicalLimit = kernel.get(BatchUpdateTechnicalLimit);
  });
  beforeEach(async () => {
    MockDate.set(new Date('2021-04-21T00:00:00.000Z'));
    nock.restore();
    nock.activate();
    jest.clearAllMocks();

    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
    nock.enableNetConnect();
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

  it('should update technical limit for all payment accounts', async () => {
    for await (const account of batchUpdateTechnicalUsers) {
      await kernel
        .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
        .save(account);
    }

    const successUpdateAccount = await batchUpdateTechnicalLimit.execute();
    const successUpdateAccountUids = successUpdateAccount.map(account => account.props.uid);

    expect(successUpdateAccountUids).toContain(bankAccountBasicProperties.uid);
    expect(successUpdateAccountUids).toContain(bankAccountBasicPropertiesSecond.uid);
    expect(successUpdateAccountUids).toContain(bankAccountBasicPropertiesThrid.uid);
  });

  it('should update technical limit for 1 of 3 payment accounts (partials errors)', async () => {
    const expectedUpdatedTechnicalLimit = 1930;
    for await (const account of batchUpdateTechnicalUsers) {
      await kernel
        .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
        .save(account);
    }

    const [successUpdateAccount] = await batchUpdateTechnicalLimit.execute();

    expect(successUpdateAccount.props.uid).toBe(bankAccountBasicProperties.uid);
    expect(successUpdateAccount.getTechnicalLimit()).toBe(expectedUpdatedTechnicalLimit);
  });
});
