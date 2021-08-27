import * as nock from 'nock';
import { ConfigService } from '@oney/envs';
import * as path from 'path';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../fixtures/config/config';
import { setupKernel } from '../fixtures/config/config.kernel';
import { userTestCredentials } from '../fixtures/bankAccounts/userTestCredentials';
import { initMongooseConnection } from '../../adapters/services/MongoService';

const envPath = path.resolve(__dirname + '/../env/test.env');

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/featureFlags`);

describe('Bank Account unit testing', () => {
  let dependencies: DomainDependencies;

  beforeAll(async () => {
    await new ConfigService({ localUri: envPath }).loadEnv();
    const dbConnection = await initMongooseConnection(process.env.MONGO_URL);
    testConfiguration.featureFlagAggregation = false;
    const kernel = await setupKernel(testConfiguration, false, dbConnection);
    await kernel.initIdentityLib();
    kernel.initBlobStorage();
    dependencies = kernel.getDependencies();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  it('should return only Oney account if feature flag aggregation is off', async () => {
    const { nockDone } = await nockBack('getBankAccount.json');
    const { userId, userToken } = userTestCredentials;
    const accounts = await dependencies.getAllBankAccounts.execute({
      userId,
      userToken,
    });
    expect(accounts).toEqual(expect.arrayContaining([accounts[0]]));
    nockDone();
  });

  it('should return Oney transactions if feature flag aggregation is off', async () => {
    const { nockDone } = await nockBack('getTransactions.json');
    const { userId, userToken } = userTestCredentials;
    const transactions = await dependencies.getAllTransactions.execute({
      userId,
      userToken,
    });
    expect(transactions).toEqual(expect.arrayContaining([transactions[0]]));
    nockDone();
  });
});
