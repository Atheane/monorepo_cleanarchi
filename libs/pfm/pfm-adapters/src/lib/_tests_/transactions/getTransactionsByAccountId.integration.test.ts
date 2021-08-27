import * as nock from 'nock';
import * as dateMock from 'jest-date-mock';
import { ConfigService } from '@oney/envs';
import { TransactionError, P2p } from '@oney/pfm-core';
import * as path from 'path';
import { DomainDependencies } from '../../di/DomainDependencies';
import { getEventModel } from '../../adapters/mongodb/models/BudgetInsight';
import { seedEvents } from '../fixtures/transactions/seedEvents';
import { P2pTransactions } from '../fixtures/transactions/P2pTransactions';
import { testConfiguration } from '../fixtures/config/config';
import { initMongooseConnection } from '../../adapters/services/MongoService';
import { setupKernel } from '../fixtures/config/config.kernel';
import { userTestCredentials } from '../fixtures/bankAccounts/userTestCredentials';
import { getAccountStatementModel, getP2pModel } from '../../adapters/mongodb/models';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/transactions`);
nockBack.setMode('record');
const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Get getTransactionsByAccountId integration testing', () => {
  let dependencies: DomainDependencies;

  beforeAll(async () => {
    await new ConfigService({ localUri: envPath }).loadEnv();
    const dbConnection = await initMongooseConnection(process.env.MONGO_URL);
    const kernel = await setupKernel(testConfiguration, false, dbConnection);
    await kernel.initIdentityLib();
    kernel.initBlobStorage();
    dependencies = kernel.getDependencies();
    nock.enableNetConnect();
  });

  beforeEach(async () => {
    dateMock.clear();
    await getEventModel().deleteMany({});
    await getP2pModel().deleteMany({});
    await getAccountStatementModel().deleteMany({});
    await getEventModel().insertMany(seedEvents);
  });

  it('should get transactions of a given account for a specific date in ASC order', async () => {
    ////
    const { nockDone } = await nockBack('getTransactionsByAccountIdInASCOrder.json');

    const { userId, userToken } = userTestCredentials;

    const result = await dependencies.getTransactionsByAccountId.execute({
      userId,
      userToken,
      accountId: '8254',
      query: {
        sortBy: 'date;ASC',
        dateFrom: new Date('2020-09-01').getTime(),
        dateTo: new Date('2020-09-05').getTime(),
      },
    });
    expect(result.length).toEqual(2);
    expect(
      result.every(
        t =>
          new Date(t.date).getTime() >= new Date('2020-09-01').getTime() &&
          new Date(t.date).getTime() < new Date('2020-09-05').getTime(),
      ),
    ).toBeTruthy();
    expect(new Date(result[0].date).getTime()).toBeLessThanOrEqual(new Date(result[1].date).getTime());
    nockDone();
  });

  it('should get P2P among other transactions for a specific account', async () => {
    const { nockDone } = await nockBack('getP2PTransactionsAmongOthers.json');
    dateMock.advanceTo(new Date('2020-09-01T16:32:29.047Z'));

    const { userId, userToken } = userTestCredentials;
    await Promise.all(P2pTransactions.map(p2p => dependencies.p2pRepository.create(new P2p(p2p))));

    const result = await dependencies.getTransactionsByAccountId.execute({
      userId,
      userToken,
      accountId: '1388',
      query: {
        sortBy: 'date;ASC',
        dateFrom: new Date('2020-09-01').getTime(),
        dateTo: new Date('2020-09-05').getTime(),
      },
    });

    expect(result).toMatchSnapshot();
    nockDone();
  });

  it('should not get P2P when date not corresponding', async () => {
    const { nockDone } = await nockBack('getP2PTransactionsAmongOthers.json');
    dateMock.advanceTo(new Date('2020-09-06T16:32:29.047Z'));

    const { userId, userToken } = userTestCredentials;
    await Promise.all(P2pTransactions.map(p2p => dependencies.p2pRepository.create(new P2p(p2p))));

    const result = await dependencies.getTransactionsByAccountId.execute({
      userId,
      userToken,
      accountId: '1388',
      query: {
        sortBy: 'date;ASC',
        dateFrom: new Date('2020-09-01').getTime(),
        dateTo: new Date('2020-09-05').getTime(),
      },
    });

    expect(result).toMatchSnapshot();
    nockDone();
  });

  it('should throw a tInvalid query erro', async () => {
    const { nockDone } = await nockBack('getP2PTransactionsAmongOthers.json');
    dateMock.advanceTo(new Date('2020-09-06T16:32:29.047Z'));

    const { userId, userToken } = userTestCredentials;
    await Promise.all(P2pTransactions.map(p2p => dependencies.p2pRepository.create(new P2p(p2p))));

    const result = dependencies.getTransactionsByAccountId.execute({
      userId,
      userToken,
      accountId: '1388',
      query: { badParams: 'test' },
    });

    await expect(result).rejects.toThrow(TransactionError.InvalidQuery);
    nockDone();
  });

  it('should throw a transaction not found error', async () => {
    const { nockDone } = await nockBack('transactionNotFound.json');
    const { userId, userToken } = userTestCredentials;
    const result = dependencies.getTransactionById.execute({
      userId,
      userToken,
      transactionId: 'nimp',
    });

    await expect(result).rejects.toThrow(TransactionError.TransactionNotFound);
    nockDone();
  });

  it('should get a list of transactions including P2Ps for a given account id', async () => {
    const { nockDone } = await nockBack('getTransactionsByAccountId.json');

    const { userId, userToken } = userTestCredentials;

    // no http calls needs to be mocked here, because we specify accountId
    const result = await dependencies.getTransactionsByAccountId.execute({
      userId,
      userToken,
      accountId: '1388',
    });

    const transaction = result.find(t => t.refId === 'a-9F3q0Ov');
    expect(result.length).toEqual(117);
    expect(transaction.amount.value).toEqual(2);
    expect(transaction.type).toEqual('TRANSFER');

    nockDone();
  });

  it('should get a list of transactions for a given account id', async () => {
    const { nockDone } = await nockBack('getTransactionsByAccountId.json');

    const { userId, userToken } = userTestCredentials;

    // no http calls needs to be mocked here, because we specify accountId
    const result = await dependencies.getTransactionsByAccountId.execute({
      userId,
      userToken,
      accountId: '8241',
    });

    const transaction = result.find(t => t.refId === '126855');
    expect(result.length).toEqual(106);
    expect(transaction.amount.value).toEqual(9.9);
    expect(transaction.label).toEqual('PRLV SEPA ParisVilliers');
    expect(transaction.type).toEqual('ORDER');

    nockDone();
  });

  it('should get a list of updated transactions', async () => {
    const { nockDone } = await nockBack('getTransactionsByAccountIdUpdatedList.json');

    const { userId, userToken } = userTestCredentials;

    const result = await dependencies.getTransactionsByAccountId.execute({
      userId,
      userToken,
      accountId: '8254',
    });

    const transaction = result.find(t => t.refId === '126348');
    expect(result.length).toEqual(2);
    expect(transaction.amount.value).toEqual(76.61);
    expect(transaction.status).toEqual('CLEARED');
    nockDone();
  });

  it('should throw an error bank account not found', async () => {
    const { nockDone } = await nockBack('bankAccountNotFound.json');
    const { userId, userToken } = userTestCredentials;

    const result = dependencies.getTransactionsByAccountId.execute({
      userId,
      userToken,
      accountId: 'nimp',
    });

    await expect(result).rejects.toThrow(TransactionError.AccountNotFound);
    nockDone();
  });

  afterAll(async () => {
    nock.enableNetConnect();
  });
});
