import * as nock from 'nock';
import * as dateMock from 'jest-date-mock';
import { ConfigService } from '@oney/envs';
import { TransactionError, AmountPositive, P2p } from '@oney/pfm-core';
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

describe('Get TransactionIdById integration testing', () => {
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

  it('should get a specific smoney transaction', async () => {
    const { nockDone } = await nockBack('getTransactionById.json');
    const { userId, userToken } = userTestCredentials;
    const transactionId = 'a-9F3q0Ov';

    const result = await dependencies.getTransactionById.execute({
      userId,
      userToken,
      transactionId,
    });

    expect(result).toEqual({
      refId: 'a-9F3q0Ov',
      bankAccountId: '1388',
      amount: new AmountPositive(2),
      originalAmount: new AmountPositive(2),
      clearingDate: null,
      date: new Date('2020-09-01T17:06:03.000Z'),
      conversionRate: null,
      currency: 'EUR',
      direction: 'OUT',
      rejectionReason: null,
      status: 'CLEARED',
      type: 'TRANSFER',
      fees: null,
      isDeposit: false,
      label: 'Not provided',
      counterParty: {
        id: '992',
        iban: 'FR02xxxxxxxxxxxxxxxx3L43',
        fullname: 'Testvirement',
      },
    });
    nockDone();
  });

  it('should get a specific budgetInsight transaction', async () => {
    const { userId, userToken } = userTestCredentials;
    const transactionId = '126348';
    const result = await dependencies.getTransactionById.execute({
      userId,
      userToken,
      transactionId,
    });

    expect(result).toEqual({
      refId: '126348',
      bankAccountId: '8254',
      amount: new AmountPositive(76.61),
      originalAmount: new AmountPositive(64.92),
      date: '2020-09-01',
      conversionRate: null,
      currency: 'EUR',
      direction: 'OUT',
      rejectionReason: null,
      status: 'CLEARED',
      type: 'CARD',
      label: "HALL'S BEER",
      fees: null,
      isDeposit: false,
      card: {
        cardId: null,
        pan: null,
        merchant: null,
      },
    });
  });

  it('should get a specific Smoney P2P transaction', async () => {
    dateMock.advanceTo(new Date('1945-05-08T16:32:29.047Z'));
    const { nockDone } = await nockBack('transactionP2PFound.json');
    await Promise.all(P2pTransactions.map(p2p => dependencies.p2pRepository.create(new P2p(p2p))));
    const { userId, userToken } = userTestCredentials;
    const transactionId = 'gaerh';
    const result = await dependencies.getTransactionById.execute({
      userId,
      userToken,
      transactionId,
    });

    expect(result).toMatchSnapshot();
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

  afterAll(async () => {
    nock.enableNetConnect();
  });
});
