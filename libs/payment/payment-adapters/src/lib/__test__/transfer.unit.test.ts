/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  BeneficiaryError,
  MakeTransfer,
  PaymentError,
  PaymentIdentifier,
  WriteService,
} from '@oney/payment-core';
import * as nock from 'nock';
import * as queryString from 'querystring';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { senderBankAccount, beneficiaryBankAccount } from './fixtures/smoneyTransfer/bankAccounts.fixtures';
import { PaymentKernel } from '../di/PaymentKernel';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyTransfer`);
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

describe('Test suite for transfer', () => {
  let kernel: PaymentKernel;
  let makeTransfer: MakeTransfer;
  let writeService: WriteService;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });

    kernel = await initializePaymentKernel({ useAzure: true });

    writeService = kernel.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    await writeService.upsert({ uid: senderBankAccount.uid }, senderBankAccount);
    await writeService.upsert({ iban: beneficiaryBankAccount.iban }, beneficiaryBankAccount);
    makeTransfer = kernel.get(MakeTransfer);
    nockDone();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('beneficiary is an oney account', async () => {
    // GIVEN
    const { nockDone } = await nockBack('sct_p2p.json', { before });
    const request = {
      amount: 20,
      userId: '_lHXbttPN',
      beneficiaryId: '5846',
      message: 'aze',
      recurrency: null,
      executionDate: new Date('10-09-2021'),
    };

    // WHEN
    const result = await makeTransfer.execute(request);

    // THEN
    expect(result.props.tag.operationCodeType).toEqual('VIRT ENTRE CPT CLT');
    await nockDone();
  });

  it('beneficiary is a non oney account', async () => {
    // GIVEN
    const { nockDone } = await nockBack('sct_classic.json', { before });
    const result = await makeTransfer.execute({
      amount: 20,
      userId: '_lHXbttPN',
      beneficiaryId: '3067',
      message: 'aze',
      recurrency: null,
      executionDate: new Date('10-09-2021'),
    });
    expect(result.props.tag).toBeFalsy();
    await nockDone();
  });

  it('beneficiary is a non oney account and execution date not provided', async () => {
    // GIVEN
    const { nockDone } = await nockBack('sct_classic.json', { before });
    const result = await makeTransfer.execute({
      amount: 20,
      userId: '_lHXbttPN',
      beneficiaryId: '3067',
      message: 'aze',
      recurrency: null,
      executionDate: null,
    });
    expect(result.props.tag).toBeFalsy();
    await nockDone();
  });

  it('Should reject cause frequency type non valid', async () => {
    const result = makeTransfer.execute({
      amount: 20,
      userId: '_lHXbttPN',
      beneficiaryId: '5846',
      message: 'aze',
      recurrency: {
        endRecurrency: new Date('10-09-2021'),
        frequencyType: 5,
      },
      executionDate: new Date('10-09-2021'),
    });
    await expect(result).rejects.toThrow(PaymentError.PaymentReccurentNotValid);
  });

  it('send a transfer with recurrency', async () => {
    const { nockDone } = await nockBack('sct_recurrent.json', { before });
    const result = await makeTransfer.execute({
      amount: 20,
      userId: '_lHXbttPN',
      beneficiaryId: '3067',
      message: 'aze',
      recurrency: {
        frequencyType: 0,
        endRecurrency: new Date('11-11-2021'),
      },
      executionDate: new Date('10-10-2021'),
    });
    expect(result.props.recurrence).toBeTruthy();
    expect(result.props.tag).toBeFalsy();
    await nockDone();
  });

  it('Should fail if the beneficiary does not exist', async () => {
    // GIVEN
    const { nockDone } = await nockBack('sct_p2p_ko.json', { before });
    const request = {
      amount: 20,
      userId: '_lHXbttPN',
      beneficiaryId: '99999',
      message: 'aze',
      recurrency: null,
      executionDate: new Date('10-09-2021'),
    };

    // WHEN
    const result = makeTransfer.execute(request);

    // THEN
    await expect(result).rejects.toThrow(BeneficiaryError.BeneficiaryNotFound);
    await nockDone();
  });

  afterAll(async () => {
    await writeService.clear();
  });
});
