import 'reflect-metadata';
import * as nock from 'nock';
import { TermsError } from '@oney/aggregation-core';
import * as path from 'path';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';

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
nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);
nockBack.setMode('record');

describe('Get Terms unit testing', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    nock.enableNetConnect();
  });

  afterEach(async () => {
    nock.cleanAll();
  });

  it('should get the terms by version number', async () => {
    const { nockDone } = await nockBack('aggregation-cgu.json');
    const result = await dependencies.getTerms.execute({});
    expect(result).toContain('Service de connexion aux comptes');
    nockDone();
  });

  it('should get the terms by version number', async () => {
    const { nockDone } = await nockBack('aggregation-cgu-specific-version.json');
    const result = await dependencies.getTerms.execute({ versionNumber: '20210323' });
    expect(result).toContain('Service de connexion aux comptes');
    nockDone();
  });

  it('should throw terms document not found', async () => {
    const { nockDone } = await nockBack('fake_version.json');

    const result = dependencies.getTerms.execute({ versionNumber: 'fake_version' });
    await expect(result).rejects.toThrow(TermsError.DocumentNotFound);

    nockDone();
  });
});
