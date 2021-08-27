import 'reflect-metadata';
import { PaymentKernel } from '@oney/payment-adapters';
import {
  BankAccountError,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  PaymentIdentifier,
  UpdateSplitPaymentEligibility,
} from '@oney/payment-core';
import * as nock from 'nock';
import * as path from 'path';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';
import { mockedBankAccountWithProductsEligibility } from './fixtures/updateBankAccountElibility/mockedBankAccount';

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
        getBlobClient: jest.fn().mockReturnValue({}),
      }),
    }),
  },
}));

describe('UpdateBankAccountEligibility usecase', () => {
  let kernel: PaymentKernel;
  let updateSplitPaymentElibility: UpdateSplitPaymentEligibility;

  beforeAll(async () => {
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/splitEligibility`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back('getAccessToken.json');

    kernel = await initializePaymentKernel({ useAzure: true });

    updateSplitPaymentElibility = kernel.get(UpdateSplitPaymentEligibility);
    nockDone();
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
    nock.cleanAll();
    nock.restore();
    nock.enableNetConnect();
  });

  it('Should update bankaccount split payment eligibility to granted', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccount);
    const uid = mockedBankAccount.props.uid;
    const splitPaymentEligibility = true;

    await updateSplitPaymentElibility.execute({ uid, splitPaymentEligibility });

    const bankAccountUpdated = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(uid);

    expect(bankAccountUpdated.props.productsEligibility.splitPayment).toBeTruthy();
  });

  it('Should update bankaccount split payment eligibility to denied', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccount);
    const uid = mockedBankAccount.props.uid;
    const splitPaymentEligibility = false;

    await updateSplitPaymentElibility.execute({ uid, splitPaymentEligibility });

    const bankAccountUpdated = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(uid);

    expect(bankAccountUpdated.props.productsEligibility.splitPayment).toBeFalsy();
  });

  it('Should not updated bankaccount split payment eligibility when the given eligibilty is already the same', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccountWithProductsEligibility);
    const uid = mockedBankAccount.props.uid;
    const spectedPaymentEligibilityDidntChanged = true;

    await updateSplitPaymentElibility.execute({
      uid,
      splitPaymentEligibility: spectedPaymentEligibilityDidntChanged,
    });

    const bankAccountUpdated = await kernel
      .get<BankAccountRepositoryRead>(PaymentIdentifier.bankAccountRepositoryRead)
      .findById(uid);

    expect(bankAccountUpdated.props.productsEligibility.splitPayment).toBe(
      spectedPaymentEligibilityDidntChanged,
    );
  });

  it('Should return error BankAccountNotFound when bankaccount doesnt exist', async () => {
    const uid = 'fakeUserNoExist';
    const splitPaymentEligibility = false;

    const usecase = updateSplitPaymentElibility.execute({ uid, splitPaymentEligibility });

    await expect(usecase).rejects.toThrow(BankAccountError.BankAccountNotFound);
  });
});
