import * as nock from 'nock';
import * as dateMock from 'jest-date-mock';
import { ConfigService } from '@oney/envs';
import { Amount, NonCardTransaction, P2p, TransactionError, TransactionType } from '@oney/pfm-core';
import { Currency, TransactionSource } from '@oney/common-core';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import * as path from 'path';
import { DomainDependencies } from '../../di/DomainDependencies';
import { getEventModel } from '../../adapters/mongodb/models/BudgetInsight';
import { seedEvents } from '../fixtures/transactions/seedEvents';
import { SMoneyTransactionsSDDNullOriginalAmount } from '../fixtures/transactions/SMoneyTransactionsSDDNullOriginalAmount';
import { testConfiguration } from '../fixtures/config/config';
import { initMongooseConnection } from '../../adapters/services/MongoService';
import { setupKernel } from '../fixtures/config/config.kernel';
import { P2pTransactions } from '../fixtures/transactions/P2pTransactions';
import { TransactionsWithNullAmounts } from '../fixtures/transactions/TransactionsWithNullAmounts';
import { userTestCredentials } from '../fixtures/bankAccounts/userTestCredentials';
import { userWithNoAggregatedAccounts } from '../fixtures/bankAccounts/userWithNotAggregatedAccounts';
import { getAccountStatementModel, getP2pModel } from '../../adapters/mongodb/models';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/transactions`);
nockBack.setMode('record');
const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Get getAllTransactions integration testing', () => {
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

  it('should return a SCT OUT with the counterparty', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    const { userId, userToken } = userTestCredentials;

    const result = await dependencies.getAllTransactions.execute({
      userToken,
      userId,
    });

    const transaction = result.find(t => t.refId === 'a-9F3q0Ov') as NonCardTransaction;

    expect(transaction.type).toEqual('TRANSFER');
    expect(transaction.counterParty).toEqual({
      id: '992',
      iban: 'FR02xxxxxxxxxxxxxxxx3L43',
      fullname: 'Testvirement',
    });
    nockDone();
  });

  it('should return a SCT IN with the counterparty', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    const { userId, userToken } = userTestCredentials;

    const result = await dependencies.getAllTransactions.execute({
      userToken,
      userId,
    });

    const transaction = result.find(t => t.refId === 'wZRl5OM2y') as NonCardTransaction;

    expect(transaction.type).toEqual('TRANSFER');
    expect(transaction.counterParty).toEqual({
      id: '992',
      iban: 'FR8112869000020PC0000012K39',
      fullname: 'Corinne Berthier',
    });
    nockDone();
  });

  it('should get all transactions for a user', async () => {
    // need to mock http call here, because we need to get users accountIds
    const { nockDone } = await nockBack('getAllTransactions.json');
    const { userId, userToken } = userTestCredentials;

    const result = await dependencies.getAllTransactions.execute({
      userToken,
      userId,
    });

    const transaction = result.find(t => t.refId === '126348');

    expect(result.length).toEqual(228);
    const { amount } = await dependencies.mappers.transactionMapper.fromDomain(transaction);
    expect(amount).toEqual(76.61);
    expect(transaction.label).toEqual("HALL'S BEER");
    expect(transaction.type).toEqual('CARD');
    nockDone();
  });

  it('should return a quasi cash transaction as a card transaction', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    const { userId, userToken } = userTestCredentials;

    const result = await dependencies.getAllTransactions.execute({
      userToken,
      userId,
    });

    const transaction = result.find(t => t.refId === 'RimG1b3Tf');

    expect(transaction.type).toEqual('CARD');
    nockDone();
  });

  it('should get no transactions for an account which has no SMO operations, no aggregated accounts and no P2P transactions', async () => {
    const { nockDone } = await nockBack('getAllTransactionsNotAggregated.json');
    const result = await dependencies.getAllTransactions.execute(userWithNoAggregatedAccounts);
    expect(result.length).toEqual(0);
    nockDone();
  });

  it('should throw an query validation error if not sortBy date', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    const { userId, userToken } = userTestCredentials;
    const result = dependencies.getAllTransactions.execute({
      userToken,
      userId,
      query: {
        sortBy: 'nimp',
        dateFrom: 1,
        dateTo: 2,
      },
    });
    await expect(result).rejects.toThrow(TransactionError.InvalidQuery);
    nockDone();
  });

  it('should throw an query validation error if wrong enum for sort by date', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    const { userId, userToken } = userTestCredentials;
    const result = dependencies.getAllTransactions.execute({
      userToken,
      userId,
      query: {
        sortBy: 'date;nimp',
        dateFrom: 1,
        dateTo: 2,
      },
    });
    await expect(result).rejects.toThrow(TransactionError.InvalidQuery);
    nockDone();
  });

  it('should throw an query validation error if dateFrom later than dateTo', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    const { userId, userToken } = userTestCredentials;
    const result = dependencies.getAllTransactions.execute({
      userToken,
      userId,
      query: {
        sortBy: 'date;ASC',
        dateFrom: 3,
        dateTo: 2,
      },
    });
    await expect(result).rejects.toThrow(TransactionError.InvalidQuery);
    nockDone();
  });

  it('should throw an query validation error if dateFrom earlier than 2019-01-01', async () => {
    const { nockDone } = await nockBack('getAllTransactions.json');
    const { userId, userToken } = userTestCredentials;
    const result = dependencies.getAllTransactions.execute({
      userToken,
      userId,
      query: {
        sortBy: 'date;ASC',
        dateFrom: 3,
        dateTo: 5,
      },
    });
    await expect(result).rejects.toThrow(TransactionError.InvalidQuery);
    nockDone();
  });

  it('should get transaction for a specific date in ASC order', async () => {
    const { nockDone } = await nockBack('getTransactionsByDate.json');
    const { userId, userToken } = userTestCredentials;
    const result = await dependencies.getAllTransactions.execute({
      userToken,
      userId,
      query: {
        sortBy: 'date;ASC',
        dateFrom: new Date('2020-09-01').getTime(),
        dateTo: new Date('2020-09-05').getTime(),
      },
    });

    expect(result.length).toEqual(12);
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

  it('should get p2p among other transactions for all accounts', async () => {
    dateMock.advanceTo(new Date('2020-09-04T16:32:29.047Z'));
    const { nockDone } = await nockBack('getTransactionsByDate.json');
    const { userId, userToken } = userTestCredentials;
    await Promise.all(P2pTransactions.map(p2p => dependencies.p2pRepository.create(new P2p(p2p))));

    const result = await dependencies.getAllTransactions.execute({
      userToken,
      userId,
      query: {
        sortBy: 'date;ASC',
        dateFrom: new Date('2020-09-01').getTime(),
        dateTo: new Date('2020-09-05').getTime(),
      },
    });

    expect(result).toMatchSnapshot();
    nockDone();
  });

  it('should not get p2p among other transactions for all accounts when date not corresponding', async () => {
    dateMock.advanceTo(new Date('2020-08-01T16:32:29.047Z'));
    const { nockDone } = await nockBack('getTransactionsByDate.json');
    const { userId, userToken } = userTestCredentials;
    await Promise.all(P2pTransactions.map(p2p => dependencies.p2pRepository.create(new P2p(p2p))));

    const result = await dependencies.getAllTransactions.execute({
      userToken,
      userId,
      query: {
        sortBy: 'date;ASC',
        dateFrom: new Date('2020-09-01').getTime(),
        dateTo: new Date('2020-09-05').getTime(),
      },
    });

    expect(result).toMatchSnapshot();
    nockDone();
  });

  it('should get SMO SDD transactions and other special cases covered by mapper', async () => {
    const account = {
      id: '1388',
      name: 'Corinne Berthier',
      number: null,
      currency: Currency.EUR,
      balance: new Amount(4210.54),
      metadatas: {
        iban: 'FR8112869000020PC0000012K39',
        fullname: 'John Doe',
      },
      bank: {
        name: 'Oney Banque Digitale',
        logo: 'https://logo.clearbit.com/oney.fr?size=200',
        source: TransactionSource.ODB,
      },
    };
    const result = await SMoneyTransactionsSDDNullOriginalAmount.map(raw =>
      dependencies.mappers.transactionSMoneyMapper.toDomain({
        accounts: [account],
        raw,
      }),
    );
    expect(result[0].type).toEqual(TransactionType.ORDER);
  });

  it('should allow for negative balance', async () => {
    const account = {
      id: '1388',
      name: 'Corinne Berthier',
      number: null,
      currency: Currency.EUR,
      balance: new Amount(-4210.54),
      metadatas: {
        iban: 'FR8112869000020PC0000012K39',
        fullname: 'John Doe',
      },
      bank: {
        name: 'Oney Banque Digitale',
        logo: 'https://logo.clearbit.com/oney.fr?size=200',
        source: TransactionSource.ODB,
      },
    };
    expect(account.balance.value).toEqual(-4210.54);
  });

  it('should give an empty array if error with transaction services', async () => {
    const { nockDone } = await nockBack('getEmptyTransactionsArray.json');
    const result = await dependencies.getTransactionService.getAllTransactions({
      accountsIds: [],
      userId: 'unknown',
      userToken: 'tchatche',
    });
    expect(result).toEqual([]);
    nockDone();
  });

  it('should give an empty array if no transactions', async () => {
    const { nockDone } = await nockBack('getEmptyTransactionsArray.json');
    const { userId, userToken } = userWithNoAggregatedAccounts;
    const result = await dependencies.getTransactionService.getAllTransactions({
      accountsIds: [],
      userId,
      userToken,
      transactionSources: [TransactionSource.ODB],
    });
    expect(result).toEqual([]);
    nockDone();
  });

  it('should return null if amount, originalAMount, currency or fees are null', async () => {
    const formattedTransactions = TransactionsWithNullAmounts.map(t =>
      dependencies.mappers.transactionMapper.fromDomain(t),
    );
    expect(formattedTransactions[0].originalAmount).toBeNull();
    expect(formattedTransactions[0].amount).toEqual(20);
    expect(formattedTransactions[0].fees).toEqual(20);
  });

  afterAll(async () => {
    nock.enableNetConnect();
  });
});
