import * as dateMock from 'jest-date-mock';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import { CreditDecisioningError } from '@oney/aggregation-core';
import * as path from 'path';
import { initMongooseConnection } from '../../adapters/services/MongoService';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';
import { createUser, aggregateAccounts, payloadSignIn, stateCase } from '../generate.fixtures';

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

describe('PP2reve integration testing', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;
  let saveFixture: Function;
  const userId = 'K-oZktdWv';
  const testIt: any = test;

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(false);
    await initMongooseConnection(process.env.MONGO_URL);
    dependencies = kernel.getDependencies();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(async () => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', testIt.getFixtureName());
      saveFixture();
    }
  });

  afterAll(async () => {
    nock.cleanAll();
  });

  it('should throw transactionsAlreadyPosted error if posted twice', async () => {
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);

    await dependencies.postAllTransactions.execute({
      userId,
    });

    const result = dependencies.postAllTransactions.execute({
      userId,
    });
    await expect(result).rejects.toThrow(CreditDecisioningError.TransactionsAlreadyPosted);
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
    await dependencies.deleteUser.execute({ userId });
  });
});
