import { Bank, BankError } from '@oney/aggregation-core';
import * as nock from 'nock';
import * as path from 'path';
import { bankFields } from './fixtures/bankFieldsWithRegExpOnListType';
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

describe('Bank unit testing', () => {
  let dependencies: DomainDependencies;
  beforeAll(async () => {
    const kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('Should get all banks', async () => {
    const { nockDone } = await nockBack('connectors.json');
    const result = await dependencies.getAllBanks.execute();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: '16188' }),
        expect.objectContaining({ code: '30004' }),
        expect.objectContaining({ name: 'Hello bank!' }),
      ]),
    );
    expect(result).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Air France (relevés Flying Blue)' })]),
    );
    nockDone();
  });

  it('Should get bank by id', async () => {
    const { nockDone } = await nockBack('bnp.json');
    const result = await dependencies.getBankById.execute({
      id: 'f711dd7a-6289-5bda-b3a4-f2febda8c046',
    });
    expect(result.code).toEqual('30004');
    nockDone();
  });

  it('Should get the test connector', async () => {
    const { nockDone } = await nockBack('testConnector.json');
    const result = await dependencies.getBankById.execute({
      id: '338178e6-3d01-564f-9a7b-52ca442459bf',
    });
    expect(result.code).toEqual('00000');
    nockDone();
  });

  it('Should get error BankNotFound', async () => {
    const { nockDone } = await nockBack('bnp.json');
    const result = dependencies.getBankById.execute({
      id: 'iamnotfound',
    });
    await expect(result).rejects.toThrow(BankError.BankNotFound);
    nockDone();
  });

  it('getAllBanks(): bank.logo should be composed by storage endpoint(config.env) AND bank uid', async () => {
    const { nockDone } = await nockBack('logos.json');
    const blobStorageEndpoint = testConfiguration.blobStorageConfiguration.endpoint;
    const logoStoragePath = `${blobStorageEndpoint}/logo-bank`;

    const banks: Bank[] = await dependencies.getAllBanks.execute();
    const { uid } = banks[0];

    expect(banks[0].logo).toEqual(`${logoStoragePath}/${uid}.png`);
    nockDone();
  });

  it('Should return a regexp for list type fields', async () => {
    const result = await dependencies.mappers.bankMapper.toDomain(bankFields);
    expect(result.form[0].validation).toEqual(/^[0-9]+$/);
  });
});
