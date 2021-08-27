/**
 * @jest-environment node
 */
import 'reflect-metadata';
import * as nock from 'nock';
import { GetBankIdentityStatement, PaymentIdentifier, WriteService } from '@oney/payment-core';
import * as path from 'path';
import * as queryString from 'querystring';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { PaymentKernel } from '../di/PaymentKernel';
import { BlobStorageGateway } from '../adapters/gateways/BlobStorageGateway';
import { addBeneficiaryMockBankAccount } from './fixtures/smoneyBeneficiaries/beneficiaries.fixtures';

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
        listBlobsFlat: jest.fn().mockReturnValue([]),
        getBlobClient: jest.fn().mockReturnValue({
          download: jest.fn().mockReturnValue({
            readableStreamBody: new Uint8Array(naruto[0] as any),
          }),
        }),
      }),
    }),
  },
}));

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyBankIdentityStatement`);
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

describe('Test suite for GetBankIdentityStatement', () => {
  let kernel: PaymentKernel;
  let writeService: WriteService;
  let getBankIdentityStatement: GetBankIdentityStatement;

  const getBankIdentityStatementSpy = jest.spyOn(BlobStorageGateway.prototype, 'getBankIdentityStatement');

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });

    kernel = await initializePaymentKernel({ useAzure: true });

    getBankIdentityStatement = kernel.get(GetBankIdentityStatement);
    writeService = kernel.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    await writeService.upsert({ uid: addBeneficiaryMockBankAccount.uid }, addBeneficiaryMockBankAccount);

    await nockDone();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should return a file buffer', async () => {
    // GIVEN
    const request = {
      uid: addBeneficiaryMockBankAccount.uid,
    };

    // WHEN
    const bankIdentityStatement = await getBankIdentityStatement.execute(request);

    // THEN
    expect(getBankIdentityStatementSpy).toHaveBeenCalledWith('UpmekTXcJ', '7188');
    expect(bankIdentityStatement instanceof Buffer).toBeTruthy();
  });
});
