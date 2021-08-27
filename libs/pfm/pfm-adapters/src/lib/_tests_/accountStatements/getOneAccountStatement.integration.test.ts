import { ConfigService } from '@oney/envs';
import * as nock from 'nock';
import * as path from 'path';
import { testConfiguration } from '../fixtures/config/config';
import { initMongooseConnection } from '../../adapters/services/MongoService';
import { DomainDependencies } from '../../di';
import { getAccountStatementModel, getEventModel, getP2pModel } from '../../adapters/mongodb/models';
import { setupKernel } from '../fixtures/config/config.kernel';

const envPath = path.resolve(__dirname + '/../env/test.env');

nock.enableNetConnect(host => host.includes('fastdl.mongodb.org'));

describe('Get Account statement integration testing', () => {
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
    await getEventModel().deleteMany({});
    await getP2pModel().deleteMany({});
    await getAccountStatementModel().deleteMany({});
  });

  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  it('should get account statement', async () => {
    const file = path.resolve(__dirname, '../fixtures/accountStatements/accountStatement.fixtures.pdf');

    nock('https://odb0storage0dev.blob.core.windows.net')
      .persist()
      .get('/documents/bank_statements%2FOsYFhvKAT%2FeWRhpRV.pdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '14610',
        eTag: '123',
      });

    const result = await dependencies.getOneAccountStatement.execute({
      userId: 'OsYFhvKAT',
      accountStatementId: 'eWRhpRV',
    });

    expect(typeof result).toBe('object');
  });
});
