import 'reflect-metadata';
import { MongoClient } from 'mongodb';
import { UserError } from '@oney/authentication-core';
import { testConfiguration } from './fixtures/configTest';
import { usersPP2Reve } from './fixtures/usersPP2Reve';
import { AzfKernel } from '../config/di/AzfKernel';
import { DomainDependencies } from '../config/di/DomainDependencies';
import { UserProvider } from '../core/domain/types/UserProvider';
import { IAzfConfiguration } from '../config/envs';
import { initMongooseConnection } from '../config/initMongooseConnection';

jest.mock('@azure/service-bus', () => {
  return {
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
      }),
    },
  };
});

describe('Delete pp_de_reve users integration testing', () => {
  let dependencies: DomainDependencies;
  let config: IAzfConfiguration;
  beforeAll(async () => {
    config = testConfiguration;
    config.cosmosDbConfiguration.cosmosDbConnectionString = process.env.MONGO_URL;
    const dbConnection = await initMongooseConnection(config.cosmosDbConfiguration.cosmosDbConnectionString);
    const kernel = new AzfKernel(config);
    kernel.initDependencies(dbConnection);
    dependencies = kernel.getDependencies();
  });

  beforeEach(async () => {
    await Promise.all(usersPP2Reve.map(userProps => dependencies.userRepository.save(userProps)));
  });

  afterEach(async done => {
    const mongoClient = await MongoClient.connect(process.env.MONGO_URL);
    /**
     * Special case needed before dbName is explicitly mentionned in configuration
     * */
    await mongoClient.db(config.cosmosDbConfiguration.dbName).dropDatabase();
    await done();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should delete users provided by pp_de_reve', async () => {
    const predicate = { metadata: { provider: UserProvider.PP_DE_REVE } };
    // GIVEN
    const usersBefore = await dependencies.userRepository.filterBy(predicate);
    expect(usersBefore.map(user => user.props)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uid: 'ZuqWVRsmq',
          metadata: {
            provider: UserProvider.PP_DE_REVE,
            email: 'blabla@gmail.com',
          },
          email: '0535c8af-5e0a-40c7-80b5-69e8a7e1c3e4_pp_de_reve_@lead.oney.com',
        }),
        expect.objectContaining({
          uid: 'MvIjmDmuV',
          metadata: {
            provider: UserProvider.PP_DE_REVE,
            email: 'euuuuh@gmail.com',
          },
          email: 'f2d5fdd5-f91c-4b99-b92b-27a5deadceb8_pp_de_reve_@lead.oney.com',
        }),
      ]),
    );
    // // WHEN
    await dependencies.deleteUsers.execute({ predicate });
    // // THEN
    const usersAfterDelete = dependencies.userRepository.filterBy(predicate);
    await expect(usersAfterDelete).rejects.toThrow(UserError.UserNotFound);
  });

  it('should throw NO_USERS_PP_DE_REVE', async () => {
    const predicate = { metadata: { provider: UserProvider.PP_DE_REVE } };
    await dependencies.deleteUsers.execute({ predicate });
    const result = dependencies.deleteUsers.execute({ predicate });
    await expect(result).rejects.toThrow(UserError.UserNotFound);
  });
});
