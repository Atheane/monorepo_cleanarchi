/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { NetworkError, PaymentIdentifier } from '@oney/payment-core';
import * as nock from 'nock';
import { CacheGateway, TokenType } from '@oney/common-core';
import * as path from 'path';
import * as queryString from 'querystring';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { invalidClientError } from './fixtures/smoneyAuth/expectedAuthResults';
import { configuration, kvConfiguration } from './fixtures/config/Configuration';
import { Configuration, KvConfiguration } from '../di/Configuration';
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
          download: jest.fn(),
        }),
      }),
    }),
  },
}));

describe('Unit test suite for Auth', () => {
  let kernel: PaymentKernel;
  let envsConf: Configuration;
  let kvConf: KvConfiguration;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });
    envsConf = configuration;
    kvConf = kvConfiguration;
    kernel = await initializePaymentKernel({ useAzure: true, kvConf, envConf: envsConf });
    nockDone();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should get a new token on expiration', async () => {
    const { nockDone } = await nockBack('getAccessTokenKernel2.json', { before });

    // GIVEN
    const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay));
    const cacheProvider = kernel.get<CacheGateway>(PaymentIdentifier.cacheGateway);
    cacheProvider.setTtl(TokenType.ACCESS_TOKEN, 1);
    const updatedToken = cacheProvider.get(TokenType.ACCESS_TOKEN);

    // WHEN
    // Waiting for token to auto refresh
    await wait(15000);

    // THEN
    const newToken = cacheProvider.get(TokenType.ACCESS_TOKEN);
    expect(newToken.value).toBeDefined();
    expect(newToken.value).not.toBe(updatedToken.value);
    await nockDone();
  });

  it('Should throw an error on kernel init when SMONEY error', async () => {
    // GIVEN
    const error = new NetworkError.ApiResponseError('SMONEY_API_ERROR', invalidClientError.cause);
    kvConf.smoneyConfiguration.clientId = 'WrongClientId';
    const kernel2 = initializePaymentKernel({ useAzure: true, kvConf, envConf: envsConf });

    // THEN
    await expect(kernel2).rejects.toThrow(error);
  });

  it('Should keep expired token in cache and set a ttl=1 on refresh Access Token error', async () => {
    const scope = nock('https://sb-connect.xpollens.com').post('/connect/token').reply(401);
    const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay));

    // GIVEN
    const cacheProvider = kernel.get<CacheGateway>(PaymentIdentifier.cacheGateway);
    const oldToken = cacheProvider.get(TokenType.ACCESS_TOKEN);
    expect(oldToken.value).toBeDefined();
    expect(oldToken.ttl).toBeGreaterThan(0);
    cacheProvider.setTtl(TokenType.ACCESS_TOKEN, 1);
    await wait(10000);

    // THEN
    expect(cacheProvider.get(TokenType.ACCESS_TOKEN).value).toBe(oldToken.value);
    // In this case we force the expiration, so the old TTl should always be less than the new one (which is 1s)
    expect(cacheProvider.get(TokenType.ACCESS_TOKEN).ttl).toBeLessThan(oldToken.ttl);

    scope.done();
  });
});
