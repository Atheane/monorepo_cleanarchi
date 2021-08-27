import {
  BankAccountError,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  CalculateBankAccountExposure,
  ExposureError,
  Exposure,
  BankAccount,
} from '@oney/payment-core';
import * as nock from 'nock';
import * as path from 'path';
import 'reflect-metadata';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedBankAccount, mockedBankAccountProps } from './fixtures/smoneyUser/createBankAccountMock';
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

describe('CalculateBankAccountExposure usecase', () => {
  let saveFixture: Function;
  let calculateBankAccountExposure: CalculateBankAccountExposure;
  let kernel: PaymentKernel;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/CalculateBankAccountExposure`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    calculateBankAccountExposure = kernel.get(CalculateBankAccountExposure);
    nockDone();
  });

  beforeEach(async () => {
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
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
  });

  it('Should return exposition amount = 4380 when balance is 1500 euros', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccount);
    const expectedExpositionAmount = 4380;
    const userIdToTest = 'kTDhDRrHv';

    const expositionAmount: Exposure = await calculateBankAccountExposure.execute({ uid: userIdToTest });
    expect(expositionAmount.amount).toEqual(expectedExpositionAmount);
  });

  it('Should min exposition when user is not eligible for split payment', async () => {
    await kernel.get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite).save(
      new BankAccount({
        ...mockedBankAccountProps,
        productsEligibility: {
          account: false,
          splitPayment: false,
        },
      }),
    );
    const expectedExpositionAmount = 0;
    const userIdToTest = 'kTDhDRrHv';

    const expositionAmount: Exposure = await calculateBankAccountExposure.execute({ uid: userIdToTest });
    expect(expositionAmount.amount).toEqual(expectedExpositionAmount);
  });

  it('Should min exposition when user has insufficient balance', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccount);
    const expectedExpositionAmount = 0;
    const uid = 'kTDhDRrHv';

    const expositionAmount = await calculateBankAccountExposure.execute({ uid });
    expect(expositionAmount.amount).toEqual(expectedExpositionAmount);
  });

  it('Should return error BankAccountNotFound when bankaccount doesnt exist', async () => {
    const uid = 'fakeUserNoExist';

    const useCase = calculateBankAccountExposure.execute({ uid });

    await expect(useCase).rejects.toThrow(BankAccountError.BankAccountNotFound);
  });

  it('Should throw when update smoney exposure request fails', async () => {
    const uid = 'kTDhDRrHv';

    const usecase = calculateBankAccountExposure.execute({ uid });

    await expect(usecase).rejects.toThrow(ExposureError.ExposureSyncFailure);
  });

  it('Should throw when get smoney balance request fails', async () => {
    const uid = 'kTDhDRrHv';

    const usecase = calculateBankAccountExposure.execute({ uid });

    await expect(usecase).rejects.toThrow(ExposureError.ExposureSyncFailure);
  });
});
