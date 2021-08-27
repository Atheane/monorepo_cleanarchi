import * as request from 'supertest';
import * as express from 'express';
import * as nock from 'nock';
import { getEventModel, getP2pModel, getAccountStatementModel } from '@oney/pfm-adapters';
import * as path from 'path';
// import { naruto } from './fixtures/naruto';
import { seedEvents } from './fixtures/seedEvents';
import { userTestCredentials } from './fixtures/userTestCredentials';
import { configureApp, initRouter } from '../config/server/express';

const app: express.Application = express();

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);
nockBack.setMode('record');

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        getBlobClient: jest.fn().mockReturnValue({}),
      }),
    }),
  },
}));

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

describe('User Controller integration testing', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    await configureApp(app, envPath, process.env.MONGO_URL);
    await initRouter(app);
  });

  beforeEach(async () => {
    nock.enableNetConnect();
    await getEventModel().deleteMany({});
    await getP2pModel().deleteMany({});
    await getAccountStatementModel().deleteMany({});
    await getEventModel().insertMany(seedEvents);
  });

  afterAll(async () => {
    nock.enableNetConnect();
  });

  it('Should get a list of smoney and aggregated bank accounts', async () => {
    const { nockDone } = await nockBack('SMoneyAndAggregationBankAccounts.json');
    nock.enableNetConnect();
    const { userId, userToken } = userTestCredentials;
    const { status, body } = await request(app)
      .get(`/pfm/users/${userId}/accounts`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toEqual(200);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1388' }),
        expect.objectContaining({ name: 'Corinne Berthier' }),
        expect.objectContaining({ currency: 'EUR' }),
        expect.objectContaining({
          metadatas: {
            iban: 'FR8112869000020PC0000012K39',
            fullname: 'Corinne Berthier',
          },
        }),
        expect.objectContaining({
          bank: {
            logo: 'https://fake-test-storage.onbadi.com/logo-bank/oney.png',
            name: 'Oney Banque Digitale',
            source: 'odb',
          },
        }),
      ]),
    );
    nockDone();
  });

  it('should throw a wrong userId error', async () => {
    const { nockDone } = await nockBack('wrongUserId.json');
    nock.enableNetConnect();
    const { userToken } = userTestCredentials;
    const { status } = await request(app)
      .get(`/pfm/users/BAD_USER_ID/accounts`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toEqual(401);
    nockDone();
  });

  it.skip('should get all transactions for a user', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    nock.enableNetConnect();
    const { userId, userToken } = userTestCredentials;
    const { status, body } = await request(app)
      .get(`/pfm/users/${userId}/transactions`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toEqual(200);
    const transaction = body.find(t => t.refId === '126348');
    expect(body.length).toEqual(227);
    expect(transaction.amount).toEqual('7661');
    expect(transaction.label).toEqual("HALL'S BEER");
    expect(transaction.type).toEqual('CARD');
    nockDone();
  });

  it.skip('should return a quasi cash transaction as a card transaction', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    nock.enableNetConnect();
    const { userId, userToken } = userTestCredentials;
    const { status, body } = await request(app)
      .get(`/pfm/users/${userId}/transactions`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toEqual(200);
    const transaction = body.find(t => t.refId === 'RimG1b3Tf');
    expect(transaction.type).toEqual('CARD');
    nockDone();
  });

  it.skip('should get a list of transactions for a given account id', async () => {
    const { nockDone } = await nockBack('getTransactionsByAccountId.json');
    nock.enableNetConnect();
    const { userId, userToken } = userTestCredentials;
    const accountId = '8241';
    const { status, body } = await request(app)
      .get(`/pfm/users/${userId}/accounts/${accountId}/transactions`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toEqual(200);
    const transaction = body.find(t => t.refId === '126855');
    expect(body.length).toEqual(106);
    expect(transaction.amount).toEqual('990');
    expect(transaction.label).toEqual('ParisVilliers');
    expect(transaction.type).toEqual('ORDER');
    nockDone();
  });

  it.skip('should throw an error when wrong userId when trying get transaction account', async () => {
    const { nockDone } = await nockBack('wrongUserIdOnGetTransactions.json');
    nock.enableNetConnect();
    const { userToken } = userTestCredentials;
    const { status } = await request(app)
      .get('/users/FAKE_USER_ID/accounts/FAKE_ACCOUNT_ID/transactions')
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toEqual(403);
    nockDone();
  });

  it.skip('should get transaction for a specific date in ASC order', async () => {
    const { nockDone } = await nockBack('getTransactionsByDate.json');
    nock.enableNetConnect();
    const { userId, userToken } = userTestCredentials;
    const { status, body } = await request(app)
      .get(`pfm/users/${userId}/transactions?sortBy=date;ASC&dateFrom=1598918400000&dateTo=1599264000000`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toEqual(200);
    expect(body.length).toEqual(12);
    expect(
      body.every(
        t =>
          new Date(t.date).getTime() >= new Date('2020-09-01').getTime() &&
          new Date(t.date).getTime() < new Date('2020-09-05').getTime(),
      ),
    ).toBeTruthy();
    expect(new Date(body[0].date).getTime()).toBeLessThanOrEqual(new Date(body[1].date).getTime());
    nockDone();
  });

  it.skip('should get transactions of a given account for a specific date in ASC order', async () => {
    const { nockDone } = await nockBack('getTransactionsByAccountIdByDate.json');
    nock.enableNetConnect();
    const { userId, userToken } = userTestCredentials;
    const accountId = '8254';
    const { status, body } = await request(app)
      .get(
        `pfm/users/${userId}/accounts/${accountId}/transactions?sortBy=date;ASC&dateFrom=1598918400000&dateTo=1599264000000`,
      )
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toBe(200);
    expect(body.length).toEqual(2);
    expect(
      body.every(
        t =>
          new Date(t.date).getTime() >= new Date('2020-09-01').getTime() &&
          new Date(t.date).getTime() < new Date('2020-09-05').getTime(),
      ),
    ).toBeTruthy();
    nockDone();
  });

  it.skip('should get a specific smoney transaction by id', async () => {
    const { nockDone } = await nockBack('getTransactionById.json');
    nock.enableNetConnect();
    const { userId, userToken } = userTestCredentials;
    const transactionId = 'a-9F3q0Ov';
    const { status, body } = await request(app)
      .get(`/pfm/users/${userId}/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toBe(200);
    expect(body).toEqual({
      refId: 'a-9F3q0Ov',
      bankAccountId: '1388',
      amount: '200',
      originalAmount: '200',
      date: '2020-09-01T17:06:03.000Z',
      conversionRate: null,
      currency: 'EUR',
      direction: 'OUT',
      rejectionReason: 'Not provided',
      status: 'CLEARED',
      type: 'TRANSFER',
      fees: null,
      counterParty: {
        id: '992',
        iban: 'FR02xxxxxxxxxxxxxxxx3L43',
        fullname: 'Testvirement',
      },
    });
    nockDone();
  });

  it.skip('should throw a transaction not found error', async () => {
    const { nockDone } = await nockBack('transactionNotFound.json');
    nock.enableNetConnect();
    const { userId, userToken } = userTestCredentials;
    const { status } = await request(app)
      .get(`/pfm/users/${userId}/transactions/FAKE_TRANSACTION_ID`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(status).toEqual(400);
    nockDone();
  });
});
