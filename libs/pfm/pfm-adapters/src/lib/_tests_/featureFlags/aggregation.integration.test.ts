import * as nock from 'nock';
import { ConfigService } from '@oney/envs';
import { describe, beforeAll, beforeEach, it, expect } from '@jest/globals';
import * as path from 'path';
import { DomainDependencies } from '../../di/DomainDependencies';
import { getEventModel } from '../../adapters/mongodb/models/BudgetInsight';
import { seedEvents } from '../fixtures/transactions/seedEvents';
import { testConfiguration } from '../fixtures/config/config';
import { initMongooseConnection } from '../../adapters/services/MongoService';
import { setupKernel } from '../fixtures/config/config.kernel';
import { userTestCredentials } from '../fixtures/bankAccounts/userTestCredentials';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/featureFlags`);
const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Get getAllTransactions integration testing', () => {
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

  beforeEach(async () => {
    await getEventModel().deleteMany({});
    await getEventModel().insertMany(seedEvents);
  });

  it('should return only Oney transactions if feature flag aggregation is off', async () => {
    // need to mock http call here, because we need to get users accountIds
    const { nockDone } = await nockBack('getTransactions.json');
    const { userId, userToken } = userTestCredentials;

    const result = await dependencies.getAllTransactions.execute({
      userToken,
      userId,
    });

    const transaction = result.find(t => t.refId === '126348');

    expect(result.length).toEqual(169);
    expect(transaction).toBeUndefined();
    nockDone();
  });
});
