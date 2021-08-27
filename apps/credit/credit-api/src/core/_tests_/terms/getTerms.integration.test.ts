import 'reflect-metadata';
import { initMongooseConnection } from '@oney/common-adapters';
import { SplitProduct } from '@oney/credit-messages';
import { ConfigService } from '@oney/env';
import * as nock from 'nock';
import * as dateMock from 'jest-date-mock';
import { SplitContractError } from '@oney/credit-core';
import * as path from 'path';
import * as fs from 'fs';
import { getAppConfiguration } from '../../../config/app/AppConfigurationService';
import { DomainDependencies } from '../../di';
import { loadingEnvironmentConfig } from '../../../config/env/EnvConfigurationService';
import {
  getSplitContractModel,
  getSplitPaymentScheduleModel,
  getSplitSimulationModel,
} from '../../adapters/mongodb';
import { initializeKernel } from '../fixtures/initializeKernel';

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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures`);
nockBack.setMode('record');
const nockBefore = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => ({
    ...JSON.parse(body),
    contractNumber: aRecordedBody.contractNumber,
  });
};

const envPath = path.resolve(`${__dirname}/../env/test.env`);

describe('Get Terms integration testing - implementation mongoDB', () => {
  let dependencies: DomainDependencies;
  beforeAll(async () => {
    await new ConfigService({ localUri: envPath }).loadEnv();
    await loadingEnvironmentConfig(envPath);
    const dbConnection = await initMongooseConnection(process.env.MONGO_URL);

    const configuration = getAppConfiguration();
    configuration.mongoDBConfiguration.odbCreditDbName = process.env.MONGO_DB_NAME;

    const kernel = await initializeKernel(false, configuration, dbConnection);
    dependencies = kernel.getDependencies();
  });

  afterEach(async () => {
    dateMock.clear();
  });

  beforeEach(async () => {
    dateMock.clear();
    await getSplitContractModel().deleteMany({});
    await getSplitPaymentScheduleModel().deleteMany({});
    await getSplitSimulationModel().deleteMany({});
  });

  it('should get the default terms', async () => {
    const file = path.resolve(__dirname, 'terms.fixtures.pdf');

    const nockFile = nock('https://odb0storage0dev.blob.core.windows.net')
      .persist()
      .get('/documents/20201111.pdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '14610',
        eTag: '123',
      });

    const result = await dependencies.getTerms.execute({});

    expect(typeof result).toBe('object');
    expect(result.includes(fs.readFileSync(file))).toBe(true);
    nockFile.done();
  });

  it('should get the terms by version number', async () => {
    const file = path.resolve(__dirname, 'terms.fixtures.pdf');

    const nockFile = nock('https://odb0storage0dev.blob.core.windows.net')
      .persist()
      .get('/documents/20201212.pdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '14610',
        eTag: '123',
      });

    const result = await dependencies.getTerms.execute({
      versionNumber: '20201212',
    });

    expect(typeof result).toBe('object');
    expect(result.includes(fs.readFileSync(file))).toBe(true);
    nockFile.done();
  });

  it('should get the terms by version number in the split contract', async () => {
    const { nockDone } = await nockBack('processPaymentScheduleBatch.json', { before: nockBefore });
    const simulation = await dependencies.simulateSplit.execute({
      userId: 'OsYFhvKAT',
      initialTransactionId: 'a-9F3q0Ov',
      transactionDate: new Date(),
      amount: 399,
      productsCode: [SplitProduct.DF003],
      label: 'mon super marchant',
    });
    const contract = await dependencies.createSplitContract.execute({
      simulationId: simulation[0].id,
      bankAccountId: 'tchatche',
    });
    const file = path.resolve(__dirname, 'terms.fixtures.pdf');

    const nockFile = nock('https://odb0storage0dev.blob.core.windows.net')
      .persist()
      .get('/documents/20201111.pdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '14610',
        eTag: '123',
      });

    const result = await dependencies.getTerms.execute({
      contractNumber: contract.contractNumber,
    });

    expect(typeof result).toBe('object');
    expect(result.includes(fs.readFileSync(file))).toBe(true);
    nockDone();
    nockFile.done();
  });

  it('should get an error when trying to get terms by wrong split contract number', async () => {
    const result = dependencies.getTerms.execute({
      contractNumber: '12345',
    });

    await expect(result).rejects.toThrow(SplitContractError.NotFound);
  });
});
