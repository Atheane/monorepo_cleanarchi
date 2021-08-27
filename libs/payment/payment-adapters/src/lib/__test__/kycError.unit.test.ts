/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { KycError, SendKycDocument, SendKycDocumentRequest } from '@oney/payment-core';
import * as nock from 'nock';
import * as queryString from 'querystring';
import * as path from 'path';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
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
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyKyc`);
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

describe('Test suite for kyc', () => {
  let kernel: PaymentKernel;
  let sendKycDocument: SendKycDocument;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });
    kernel = await initializePaymentKernel({ useAzure: true });
    sendKycDocument = kernel.get(SendKycDocument);
    nockDone();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
  it('Should return KycError', async () => {
    // GIVEN
    const error = new KycError.DocumentNotFound('DOCUMENT_NOT_FOUND');
    const request: SendKycDocumentRequest = {
      uid: 'WrongUID',
      documents: [],
    };

    // WHEN
    const result = sendKycDocument.execute(request);

    // THEN
    await expect(result).rejects.toThrowError(error);
  });
});
