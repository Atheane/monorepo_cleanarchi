/* eslint-env jest */
import { ConfigService } from '@oney/env';
import { EventCallbackTypes, EventCardStatuses } from '@oney/payment-messages';
import { connection } from 'mongoose';
import * as nock from 'nock';
import * as queryString from 'querystring';
import * as path from 'path';
import { keyVaultSecrets } from '../../config/config.env';
import { initMongooseConnection } from '../../config/config.mongodb';
import { DbIdentifier } from '../../core/adapters/mongodb/models/DbIdentifier';
import { DomainDependencies } from '../../core/di/DomainDependencies';
import { CardLifecycleCallbackError } from '../../core/domain/models/DomainError';
import cardLifecycleCallback, {
  mockLegacyBankAccountAccountProperties,
} from '../fixtures/cardLifecycleCallback';
import { initializeKernel } from '../fixtures/initializeKernel';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/`);
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

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Process card lifecycle callback integration testing', () => {
  let dependencies: DomainDependencies;

  beforeEach(async () => {
    await new ConfigService({ localUri: envPath }).loadEnv();
    await initMongooseConnection(process.env.MONGO_URL);
    const kernel = await initializeKernel(false, keyVaultSecrets);

    dependencies = kernel.getDependencies();

    // clean mock account management db accounts collection
    await connection.useDb(DbIdentifier.ODB_ACCOUNT_MANAGEMENT).db.collection('accounts').deleteMany({});

    // add mock account in odb account management in-memory mongo
    const accountManagementDb = connection.useDb(DbIdentifier.ODB_ACCOUNT_MANAGEMENT).db;
    await accountManagementDb.collection('accounts').insertOne({ ...mockLegacyBankAccountAccountProperties });

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

  it('should handle callback payload with status SENT', async () => {
    const { nockDone } = await nockBack('processCardLifecycleCallback.json', { before });

    const result = await dependencies.processCardLifecycleCallback.execute(
      cardLifecycleCallback.bodyWithStatusSent,
    );

    expect(result.type).toMatch(EventCallbackTypes[EventCallbackTypes.CARD_LIFECYCLE]);
    expect(Object.keys(EventCardStatuses)).toContain(result.status);
    nockDone();
  });

  it('should save the card lifecycle callback payload in odb event store', async () => {
    const result = await dependencies.processCardLifecycleCallback.execute(cardLifecycleCallback.body);

    expect(result.type).toMatch(EventCallbackTypes[EventCallbackTypes.CARD_LIFECYCLE]);
    expect(Object.keys(EventCardStatuses)).toContain(result.status);
  });

  it('should fail to handle callback payload with status SENT because no related bank account', async () => {
    const resultPromise = dependencies.processCardLifecycleCallback.execute({
      ...cardLifecycleCallback.bodyWithStatusSent,
      reference: 'card-not_related_to_bank_account',
    });

    await expect(resultPromise).rejects.toThrow(CardLifecycleCallbackError.RelatedBankAccountNotFound);
  });

  afterAll(async () => {
    await connection.close();
  });
});
