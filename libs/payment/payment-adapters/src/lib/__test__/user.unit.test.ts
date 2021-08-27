/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  BankAccount,
  BankAccountRepositoryWrite,
  GetBalance,
  GetBankAccount,
  NetworkError,
  PaymentIdentifier,
  UpdateBankAccount,
} from '@oney/payment-core';
import * as nock from 'nock';
import { subtract } from '@oney/common-core';
import { EarningsThreshold } from '@oney/profile-messages';
import * as queryString from 'querystring';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { mockedBankAccount } from './fixtures/smoneyUser/createBankAccountMock';
import { mockedLimitsSuccess } from './fixtures/transactions/smoneyMockedResponse';
import { PaymentKernel } from '../di/PaymentKernel';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyUser`);
nockBack.setMode('record');

const before = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => {
    const { of: currentOffset } = queryString.parse(`?${body}`);
    const { of: recordedOffset } = queryString.parse(`?${body}`);
    if (!(currentOffset || recordedOffset)) {
      // Just replace the saved body by a new one
      // eslint-disable-next-line no-param-reassign
      delete aRecordedBody.orderid;
      return aRecordedBody;
    }
    if (currentOffset === recordedOffset) {
      return aRecordedBody;
    }
    return body;
  };
};

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

describe('Test suite for user', () => {
  let kernel: PaymentKernel;
  let getBalance: GetBalance;
  let updateBankAccount: UpdateBankAccount;
  let getBankAccount: GetBankAccount;
  let userId: string;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });
    userId = 'ow_KFDTZq';

    kernel = await initializePaymentKernel({ useAzure: true });

    getBalance = kernel.get(GetBalance);
    updateBankAccount = kernel.get(UpdateBankAccount);
    getBankAccount = kernel.get(GetBankAccount);
    nockDone();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should get partner user account data', async () => {
    const { nockDone } = await nockBack('getAccountData.json', { before });

    const accountBalance = await getBalance.execute({ uid: userId });
    expect(accountBalance.balance).toEqual(0);
    expect(accountBalance.uid).toEqual(userId);

    nockDone();
  });

  it('should update bank account', async () => {
    const { nockDone } = await nockBack('updateAccountData.json', { before });
    await updateBankAccount.execute({ uid: userId, phone: '33789654236' });
    nockDone();
  });

  it('should update bank account with fiscal reference', async () => {
    const { nockDone } = await nockBack('updateAccountWithFatcaData.json', { before });
    await updateBankAccount.execute({
      uid: userId,
      phone: '33789654236',
      fiscalReference: { country: 'FR', fiscalNumber: '123456' },
    });
    nockDone();
  });

  it('should update bank account with declarative fiscal situation', async () => {
    const { nockDone } = await nockBack('updateAccountWithDeclarative.json', { before });
    await updateBankAccount.execute({
      uid: userId,
      declarativeFiscalSituation: { income: EarningsThreshold.THRESHOLD1, economicActivity: '11' },
    });
    nockDone();
  });

  it('should fail to update a non existing account', async () => {
    const { nockDone } = await nockBack('failUpdateAccountData.json', { before });
    const promise = updateBankAccount.execute({ uid: 'fake', phone: '33789654236' });

    await expect(promise).rejects.toThrow(NetworkError.ApiResponseError);
    nockDone();
  });

  it('should get existing account', async () => {
    await kernel
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccount);

    const bankAccount = await getBankAccount.execute({ uid: 'kTDhDRrHv' });

    expect(bankAccount).toEqual(mockedBankAccount);
  });

  it('should get existing account and update monthly allowance cause null', async () => {
    nock('https://sb-api.xpollens.com/api/V1.1')
      .get('/users/kTDhDRrHv/limits')
      .reply(200, mockedLimitsSuccess);
    const remainingFundToSpend = subtract(
      Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100),
      Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyUsedAllowance / 100),
    );
    await kernel.get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite).save(
      new BankAccount({
        ...mockedBankAccount.props,
        monthlyAllowance: {
          authorizedAllowance: 0,
          remainingFundToSpend: 0,
        },
      }),
    );

    const bankAccount = await getBankAccount.execute({ uid: 'kTDhDRrHv' });

    // case technicalLimit == globalOut
    expect(bankAccount.props).toEqual({
      ...mockedBankAccount.props,
      monthlyAllowance: {
        remainingFundToSpend,
        spentFunds: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100) - remainingFundToSpend,
        authorizedAllowance: Math.ceil(mockedLimitsSuccess.GlobalOut.MonthlyAllowance / 100),
      },
    });
  });
});
