import { expect, it, describe, beforeAll, beforeEach } from '@jest/globals';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import { BankConnectionError, User } from '@oney/aggregation-core';
import * as path from 'path';
import { initMongooseConnection } from '../../adapters/services/MongoService';
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

describe('Update connection integration testing', () => {
  let dependencies: DomainDependencies;
  const testConnector = { uuid: '338178e6-3d01-564f-9a7b-52ca442459bf' };
  beforeAll(async () => {
    nock.enableNetConnect(host => host.includes('fastdl.mongodb.org'));
    const kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(false);
    dependencies = kernel.getDependencies();
    await initMongooseConnection(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  it('Should update an existing bankConnection password', async () => {
    const { nockDone } = await nockBack('updateConnection.json');

    const user = User.create({
      userId: 'azebkazkuegyuigaz',
      consent: true,
    });

    await dependencies.userRepository.create(user.props);

    const bankConnection = await dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'par',
        },
        {
          name: 'login',
          value: 'Identifiant',
        },
        {
          name: 'password',
          value: '1234',
        },
      ],
    });

    const bankConnectionSyncToPasswordExpired = dependencies.signIn.execute({
      bankId: testConnector.uuid,
      userId: user.props.userId,
      form: [
        {
          name: 'openapiwebsite',
          value: 'passwordExpired',
        },
        {
          name: 'login',
          value: 'Identifiant',
        },
        {
          name: 'password',
          value: '1234',
        },
      ],
    });

    await expect(bankConnectionSyncToPasswordExpired).rejects.toThrow(BankConnectionError.WrongPassword);

    const bankConnectionUpdated = await dependencies.updateConnection.execute({
      ...bankConnection.props,
      form: [
        {
          name: 'openapiwebsite',
          value: 'par',
        },
        {
          name: 'login',
          value: 'Identifiant',
        },
        {
          name: 'password',
          value: '1234',
        },
      ],
    });

    expect(bankConnectionUpdated.props).toEqual({
      ...bankConnection.props,
    });

    nockDone();
  });
});
