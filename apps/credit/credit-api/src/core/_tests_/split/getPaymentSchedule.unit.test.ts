import 'reflect-metadata';
import * as nock from 'nock';
import { Authorization, IdentityProvider, Permission, Scope, ServiceName } from '@oney/identity-core';
import { IAppConfiguration } from '@oney/credit-core';
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

const envPath = path.resolve(__dirname + '/../env/test.env');

describe('Get GetPaymentSchedule unit testing', () => {
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
  });

  it('should get the getPaymentSchedule', async () => {
    const file = path.resolve(__dirname, '../fixtures/paymentSchedule.fixtures.pdf');

    nock('https://odb0storage0dev.blob.core.windows.net')
      .persist()
      .get('/documents/sample.pdf')
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '14610',
        eTag: '123',
      });

    const result = await dependencies.getPaymentSchedule.execute({
      file: 'sample.pdf',
      uid: 'OsYFhvKAT',
    });

    expect(typeof result).toBe('object');
    expect(result.includes(fs.readFileSync(file))).toBe(true);
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
    const isAuthorize = await dependencies.getPaymentSchedule.canExecute(identity, {
      file: 'sample.pdf',
      uid: 'OsYFhvKAT',
    });

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
    const isAuthorize = await dependencies.getPaymentSchedule.canExecute(identity, {
      file: 'sample.pdf',
      uid: 'OsYFhvKAT',
    });

    expect(isAuthorize).toEqual(true);
  });

  it('should return false when token ad with no credit permissions', async () => {
    const identity = {
      uid: '123456',
      name: 'oney_compta',
      provider: IdentityProvider.azure,
      roles: [],
    };
    const isAuthorize = await dependencies.getPaymentSchedule.canExecute(identity, {
      file: 'sample.pdf',
      uid: 'OsYFhvKAT',
    });

    expect(isAuthorize).toEqual(false);
  });
});
