import * as nock from 'nock';
import { ConfigService } from '@oney/envs';
import * as path from 'path';
import { DomainDependencies } from '../../di/DomainDependencies';
import { bankAccountFakeIban } from '../fixtures/bankAccounts/bankAccountFakeIban';
import { testConfiguration } from '../fixtures/config/config';
import { setupKernel } from '../fixtures/config/config.kernel';
import { userTestCredentials } from '../fixtures/bankAccounts/userTestCredentials';
import { userWithNoAggregatedAccounts } from '../fixtures/bankAccounts/userWithNotAggregatedAccounts';
import { initMongooseConnection } from '../../adapters/services/MongoService';

const envPath = path.resolve(__dirname + '/../env/test.env');

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/bankAccounts`);
nockBack.setMode('record');

describe('Bank Account unit testing', () => {
  let dependencies: DomainDependencies;

  beforeAll(async () => {
    await new ConfigService({ localUri: envPath }).loadEnv();
    const dbConnection = await initMongooseConnection(process.env.MONGO_URL);
    const kernel = await setupKernel(testConfiguration, false, dbConnection);
    await kernel.initIdentityLib();
    kernel.initBlobStorage();
    dependencies = kernel.getDependencies();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  it('Should get a list of smoney and aggregated bank accounts', async () => {
    const { nockDone } = await nockBack('SMoneyAndAggregationBankAccounts.json');
    const { userId, userToken } = userTestCredentials;
    const accounts = await dependencies.getAllBankAccounts.execute({
      userId,
      userToken,
    });
    const accountsMappedFromDomain = accounts.map(account =>
      dependencies.mappers.bankAccountMapper.fromDomain(account),
    );
    expect(accountsMappedFromDomain).toEqual([
      {
        id: '1388',
        name: 'Corinne Berthier',
        number: null,
        currency: 'EUR',
        balance: 2186.97,
        metadatas: {
          iban: 'FR8112869000020PC0000012K39',
          fullname: 'Corinne Berthier',
        },
        bank: {
          name: 'Oney Banque Digitale',
          logo: `${testConfiguration.blobStorageEndpoint}/logo-bank/${'oney'}.png`,
          source: 'odb',
        },
      },
      {
        id: '8241',
        name: 'LCL',
        number: '04000391840W',
        currency: 'EUR',
        balance: 937.61,
        metadatas: { iban: 'FR1730002040000000391840W02' },
        bank: {
          name: null,
          logo: null,
          source: 'aggregation',
        },
      },
      {
        id: '8253',
        name: 'Connecteur Test - Compte chèque EUR',
        number: '3002900000',
        currency: 'EUR',
        balance: 1707.19,
        metadatas: { iban: 'EX6713335395899300290000026' },
        bank: { name: null, logo: null, source: 'aggregation' },
      },
      {
        id: '8254',
        name: 'Connecteur Test - Compte chèque USD',
        number: '3002900001',
        currency: 'USD',
        balance: 6450.79,
        metadatas: { iban: 'EX6713335395899300290000123' },
        bank: { name: null, logo: null, source: 'aggregation' },
      },
      {
        id: '8255',
        name: 'Connecteur Test - Compte carte débit différé',
        number: 'XXXXXXXXXX982605',
        currency: 'EUR',
        balance: 0,
        metadatas: { iban: 'EX6713335395899300290000220' },
        bank: { name: null, logo: null, source: 'aggregation' },
      },
    ]);
    nockDone();
  });

  it('Should get a list of smoney accounts only', async () => {
    const { nockDone } = await nockBack('SMoneyBankAccounts.json');
    const { userId, userToken } = userWithNoAggregatedAccounts;
    const result = await dependencies.getAllBankAccounts.execute({
      userId,
      userToken,
    });
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Jeanne Durut' }),
        expect.objectContaining({ currency: 'EUR' }),
        expect.objectContaining({ number: null }),
      ]),
    );
    nockDone();
  });

  it('Should return an empty array if user has no aggregated accounts', async () => {
    const { nockDone } = await nockBack('NoAggregatedAccounts.json');

    const { userId, userToken } = userWithNoAggregatedAccounts;
    const result = await dependencies.getAllBankAccounts.execute({
      userId,
      userToken,
    });
    expect(result).toEqual(expect.arrayContaining([]));
    nockDone();
  });

  it('Should throw an invalid bank code error', async () => {
    const result = dependencies.mappers.bankAccountAggregationMapper.toDomain(bankAccountFakeIban);
    expect(result.bank.name).toBeNull();
    expect(result.bank.logo).toBeNull();
  });

  it('should return empty array', async () => {
    const { nockDone } = await nockBack('SMoneyAndAggregationBankAccounts.json');
    const result = await dependencies.getAllBankAccounts.execute({
      userId: 'frnofhrh',
      userToken: 'vorjorfofoiorfj',
    });
    expect(result).toEqual([]);
    nockDone();
  });

  afterAll(async () => {
    nock.enableNetConnect();
  });
});
