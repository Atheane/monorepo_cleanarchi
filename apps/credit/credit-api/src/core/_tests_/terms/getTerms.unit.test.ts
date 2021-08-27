import 'reflect-metadata';
import { SplitProduct } from '@oney/credit-messages';
import * as nock from 'nock';
import { IAppConfiguration } from '@oney/credit-core';
import { Authorization, IdentityProvider, Permission, Scope, ServiceName } from '@oney/identity-core';
import * as path from 'path';
import * as fs from 'fs';
import { getAppConfiguration } from '../../../config/app/AppConfigurationService';
import { DomainDependencies } from '../../di';
import { loadingEnvironmentConfig } from '../../../config/env/EnvConfigurationService';
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

describe('Get Terms unit testing - implementation inMemory', () => {
  let dependencies: DomainDependencies;
  let configuration: IAppConfiguration;

  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);
    configuration = getAppConfiguration();
    const kernel = await initializeKernel(true, configuration);
    dependencies = kernel.getDependencies();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.restore();
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

  it('should return true when token azure with permissions.read=all', async () => {
    const identity = {
      uid: '123456',
      name: 'oney_compta',
      provider: IdentityProvider.azure,
      roles: [
        {
          scope: new Scope({
            name: ServiceName.credit,
          }),
          permissions: new Permission({
            write: Authorization.denied,
            read: Authorization.all,
          }),
        },
      ],
    };
    const isAuthorize = await dependencies.getTerms.canExecute(identity);

    expect(isAuthorize).toEqual(true);
  });

  it('should return true when token azure with permissions.read=self', async () => {
    const identity = {
      name: 'user',
      uid: 'OsYFhvKAT',
      roles: [
        {
          scope: new Scope({
            name: ServiceName.credit,
          }),
          permissions: new Permission({
            write: Authorization.self,
            read: Authorization.self,
          }),
        },
      ],
      provider: IdentityProvider.odb,
    };
    const isAuthorize = await dependencies.getTerms.canExecute(identity);

    expect(isAuthorize).toEqual(true);
  });

  it('should return false when token ad with no credit permissions', async () => {
    const identity = {
      uid: '123456',
      name: 'oney_compta',
      provider: IdentityProvider.azure,
      roles: [],
    };
    const isAuthorize = await dependencies.getTerms.canExecute(identity);

    expect(isAuthorize).toEqual(false);
  });
});
