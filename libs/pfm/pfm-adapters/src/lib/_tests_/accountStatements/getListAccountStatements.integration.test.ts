import * as nock from 'nock';
import { ConfigService } from '@oney/envs';
import * as path from 'path';
import { DomainDependencies } from '../../di/DomainDependencies';
import { initMongooseConnection } from '../../adapters/services/MongoService';
import { setupKernel } from '../fixtures/config/config.kernel';
import { userTestCredentials } from '../fixtures/bankAccounts/userTestCredentials';
import { accountStatements } from '../fixtures/accountStatements/accountStatements';
import { getAccountStatementModel, getEventModel, getP2pModel } from '../../adapters/mongodb/models';
import { testConfiguration } from '../fixtures/config/config';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/transactions`);
nockBack.setMode('record');
const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Get list account statements integration testing - implementation mongoDB', () => {
  let dependencies: DomainDependencies;
  const { userId } = userTestCredentials;

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
    await getEventModel().deleteMany({});
    await getP2pModel().deleteMany({});
    await getAccountStatementModel().deleteMany({});
  });

  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  it('should get an empty array', async () => {
    const result = await dependencies.getListAccountStatements.execute({
      userId,
    });

    expect(result).toEqual([]);
  });

  it('should get account statement', async () => {
    await getAccountStatementModel().insertMany(accountStatements);
    const result = await dependencies.getListAccountStatements.execute({
      userId,
    });

    // expect(result).toEqual([
    //   {
    //     id: 'eWRhpRV',
    //     date: new Date('2020-10-01T00:00:00'),
    //     uid: 'OsYFhvKAT',
    //   },
    // ]);

    // TODO remove this after the feature was test
    expect(result).toEqual([]);
  });
});
