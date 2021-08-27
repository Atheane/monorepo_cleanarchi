import 'reflect-metadata';
import * as nock from 'nock';
import * as dateMock from 'jest-date-mock';
import * as mongoose from 'mongoose';
import { User, UserError } from '@oney/aggregation-core';
import * as path from 'path';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { initMongooseConnection } from '../../adapters/services/MongoService';
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

describe('Save User Consent integration testing', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
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
    nock.cleanAll();
  });

  it('should create a new user and save its consent', async () => {
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('save-new-user-consent.json');
    const userId = 'avitazazdtur';
    const user = await dependencies.saveUserConsent.execute({ userId, consent: true });
    expect(user.props).toEqual(
      expect.objectContaining({
        userId,
        consent: true,
        consentDate: new Date('2020-05-21T00:00:00.000Z'),
      }),
    );
    nockDone();
  });

  it('should update an existing user consent', async () => {
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));
    const { nockDone } = await nockBack('save-existing-user-consent.json');
    const user = User.create({
      userId: 'azebajmoloip',
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
    const existingUser = await dependencies.saveUserConsent.execute({
      userId: user.props.userId,
      consent: true,
    });
    expect(existingUser.props).toEqual(
      expect.objectContaining({
        userId: user.props.userId,
        consent: true,
        consentDate: new Date('2020-05-21T00:00:00.000Z'),
      }),
    );
    nockDone();
  });

  it('should throw user already exists', async () => {
    const user = User.create({
      userId: 'jhgfuyf',
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
    const result = dependencies.userRepository.create(user.props);
    await expect(result).rejects.toThrow(UserError.UserAlreadyExists);
  });

  it('should get user consent', async () => {
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));

    const user = User.create({
      userId: 'azeazkljmijih',
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
    const saveUserConsent = await dependencies.checkUserConsent.execute({ userId: user.props.userId });
    expect(saveUserConsent.props).toEqual(
      expect.objectContaining({
        userId: user.props.userId,
        consent: user.props.consent,
        consentDate: new Date('2020-05-21T00:00:00.000Z'),
      }),
    );
  });

  it('should throw user unknown', async () => {
    const result = dependencies.checkUserConsent.execute({ userId: 'jbuoayzgezat' });
    await expect(result).rejects.toThrow(UserError.UserUnknown);
  });
});
