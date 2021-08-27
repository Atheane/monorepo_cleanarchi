import 'reflect-metadata';
import { MongoClient } from 'mongodb';
import { initMongooseConnection } from '@oney/common-adapters';
import { IAppConfiguration, CreditorError } from '@oney/credit-core';
import * as path from 'path';
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

describe('Create Customer', () => {
  const userId = 'OsYFhvKAT';
  let dependencies: DomainDependencies;
  let configuration: IAppConfiguration;

  beforeAll(async () => {
    await loadingEnvironmentConfig(envPath);
    const dbConnection = await initMongooseConnection(process.env.MONGO_URL);
    configuration = getAppConfiguration();
    const kernel = await initializeKernel(false, configuration, dbConnection);
    dependencies = kernel.getDependencies();
  });

  afterEach(async done => {
    const mongoClient = await MongoClient.connect(process.env.MONGO_URL);
    /**
     * Special case needed before dbName is explicitly mentionned in configuration
     * */
    await mongoClient.db('odb_credit').dropDatabase();
    await done();
  });

  it('should create Creditor', async () => {
    const creditor = await dependencies.createCreditor.execute({
      userId,
      isEligible: true,
    });
    expect(creditor.props).toEqual({
      userId,
      isEligible: true,
    });
  });

  it('should throw Creditor already exists', async () => {
    const creditorCreated = await dependencies.createCreditor.execute({
      userId: 'bnlkjkt',
      isEligible: false,
    });
    const creditor = dependencies.createCreditor.execute({
      userId: creditorCreated.props.userId,
      isEligible: true,
    });
    expect(creditor).rejects.toThrow(CreditorError.AlreadyExists);
  });

  it('should update Creditor', async () => {
    const creditorCreated = await dependencies.createCreditor.execute({
      userId: 'bgoiyfxwer',
      isEligible: false,
    });
    const creditorUpdated = await dependencies.updateCreditor.execute({
      userId: creditorCreated.props.userId,
      isEligible: true,
    });
    expect(creditorUpdated.props).toEqual({
      userId: creditorCreated.props.userId,
      isEligible: true,
    });
  });

  it('should create a new creditor if it does not exist on updateCreditor call', async () => {
    const creditor = await dependencies.updateCreditor.execute({
      userId: 'jguygfutidt',
      isEligible: false,
    });
    expect(creditor.props).toMatchObject({
      userId: 'jguygfutidt',
      isEligible: false,
    });
  });

  it('should get a creditor', async () => {
    const creditorCreated = await dependencies.createCreditor.execute({
      userId: 'azehcutd',
      isEligible: true,
    });
    const creditorRequested = await dependencies.getCreditor.execute({
      uid: creditorCreated.props.userId,
    });
    expect(creditorRequested.props).toEqual({
      userId: creditorCreated.props.userId,
      isEligible: true,
    });
  });
});
