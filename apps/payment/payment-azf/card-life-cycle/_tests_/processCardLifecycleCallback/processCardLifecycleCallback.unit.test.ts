/* eslint-env jest */
import * as nock from 'nock';
import { connection } from 'mongoose';
import { ConfigService } from '@oney/env';
import { GenericError } from '@oney/common-core';
import { EventCallbackTypes, EventCardStatuses } from '@oney/payment-messages';
import * as path from 'path';
import * as queryString from 'querystring';
import { keyVaultSecrets } from '../../config/config.env';
import { initMongooseConnection } from '../../config/config.mongodb';
import { DbIdentifier } from '../../core/adapters/mongodb/models/DbIdentifier';
import { DomainDependencies } from '../../core/di/DomainDependencies';
import { CardLifecycleCallbackError } from '../../core/domain/models/DomainError';
import cardLifecycleCallback, { mockLegacyBankAccountAccount } from '../fixtures/cardLifecycleCallback';
import { initializeKernel } from '../fixtures/initializeKernel';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/`);

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

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Process card lifecycle callback unit testing', () => {
  let dependencies: DomainDependencies;
  beforeAll(async () => {
    nock.enableNetConnect('fastdl.mongodb.org:443');
    await new ConfigService({ localUri: envPath }).loadEnv();

    const kernel = await initializeKernel(true, keyVaultSecrets);
    await initMongooseConnection(process.env.MONGO_URL);
    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    nockBack.setMode('record');

    // clean mock account management db accounts collection
    await connection.useDb(DbIdentifier.ODB_ACCOUNT_MANAGEMENT).db.collection('accounts').deleteMany({});

    const collections = await connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
  });
  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should process card lifecycle callback for several Users', async () => {
    // add mock account in odb account management mock DB
    await dependencies.bankAccountRepository.save(mockLegacyBankAccountAccount);

    const result = await dependencies.processCardLifecycleCallback.execute(cardLifecycleCallback.body);

    expect(result.date).toBeTruthy();
    expect(result.type).toMatch(EventCallbackTypes[EventCallbackTypes.CARD_LIFECYCLE]);
    expect(Object.keys(EventCardStatuses)).toContain(result.status);
  });

  it('should process callback with SENT in payload', async () => {
    const { nockDone } = await nockBack('processCardLifecycleCallback.json', { before });

    // add mock account in odb account management mock DB
    await dependencies.bankAccountRepository.save(mockLegacyBankAccountAccount);

    const result = await dependencies.processCardLifecycleCallback.execute(
      cardLifecycleCallback.bodyWithStatusSent,
    );
    await expect(result.status).toMatch(EventCardStatuses[EventCardStatuses.SENT]);
    nockDone();
  });

  it('should fail to process callback with SENT in payload because smoney card API not reachable', async () => {
    await dependencies.bankAccountRepository.save(mockLegacyBankAccountAccount);

    const resultPromise = dependencies.processCardLifecycleCallback.execute(
      cardLifecycleCallback.bodyWithStatusSent,
    );
    await expect(resultPromise).rejects.toThrow(GenericError.ApiResponseError);
  });

  it('should fail to process callback with SENT in payload because smoney call returns error', async () => {
    await dependencies.bankAccountRepository.save(mockLegacyBankAccountAccount);

    const appCardId = cardLifecycleCallback.bodyWithStatusSent.reference;

    // mock error response
    nock(keyVaultSecrets.smoneyApiBaseUrl)
      .post(`/cards/${appCardId}/display`)
      .reply(500, { message: 'Internal server error.' });

    const resultPromise = dependencies.processCardLifecycleCallback.execute(
      cardLifecycleCallback.bodyWithStatusSent,
    );
    await expect(resultPromise).rejects.toThrow(GenericError.ApiResponseError);
  });

  it('should fail to process callback with SENT in payload when smoney does not return encrypted card data', async () => {
    await dependencies.bankAccountRepository.save(mockLegacyBankAccountAccount);

    const appCardId = cardLifecycleCallback.bodyWithStatusSent.reference;

    // mock error response
    nock(keyVaultSecrets.smoneyApiBaseUrl)
      .post(`/cards/${appCardId}/display`)
      .reply(200, {
        errors: [
          {
            code: '400',
            message: 'Transaction Invalide',
            attribute: null,
            additionalInformation: null,
          },
        ],
        TransactionIdentifier: null,
        cardIDToken: null,
        signKeyIndex: null,
        encryptKeyIndex: null,
        signature: null,
        buffer: null,
        IsSuccess: true,
      });

    const resultPromise = dependencies.processCardLifecycleCallback.execute(
      cardLifecycleCallback.bodyWithStatusSent,
    );
    await expect(resultPromise).rejects.toThrow(GenericError.ApiResponseError);
  });

  it('should fail to process card lifecycle callback because no callback payload', async () => {
    const resultPromise = dependencies.processCardLifecycleCallback.execute(null);

    await expect(resultPromise).rejects.toThrow(CardLifecycleCallbackError.PayloadNotFound);
  });

  it('should fail to process card lifecycle callback with SENT status because no related bank account found', async () => {
    const { nockDone } = await nockBack('processCardLifecycleCallback.json', { before });

    const resultPromise = dependencies.processCardLifecycleCallback.execute({
      ...cardLifecycleCallback.body,
      reference: 'card-not_related_to_bank_account',
    });

    await expect(resultPromise).rejects.toThrow(CardLifecycleCallbackError.RelatedBankAccountNotFound);
    nockDone();
  });

  afterAll(async () => {
    await connection.close();
  });
});
