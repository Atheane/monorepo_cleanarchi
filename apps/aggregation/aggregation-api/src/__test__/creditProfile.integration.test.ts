import * as express from 'express';
import * as nock from 'nock';
import * as request from 'supertest';
import * as dateMock from 'jest-date-mock';
import { MongoDbUserRepository } from '@oney/aggregation-adapters';
import { Container } from 'inversify';
import { DeleteUser, UploadUserDataToCreditDecisioningPartner } from '@oney/aggregation-core';
import * as path from 'path';
import { configureApp, initRouter } from './bootstrap';
import { testConfiguration } from './config';
import { createUser, getAggregatedAccounts } from './fixtures/generate.fixtures';

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

describe('Credit Profile integration api testing', () => {
  let container: Container;
  let saveFixture: Function;
  const testIt: any = test;
  const app: express.Application = express();
  beforeAll(async () => {
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));

    container = await configureApp(testConfiguration, false, process.env.MONGO_URL);
    container.bind<MongoDbUserRepository>(MongoDbUserRepository).to(MongoDbUserRepository);
    await initRouter(app);
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;
    nock.enableNetConnect(/127\.0\.0\.1/);
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

  it('Should throw unauthorized', async () => {
    const cmd = {
      subscription: {
        disableRecovery: true,
        status: 'ACTIVE',
        subscriberId: 'subscriberIdTest',
        target: 'BASE_URL/aggregation/scoring_analysis_completed',
        eventName: 'aden_analysis_completed',
        id: 'id',
      },
      payload: { banksUserId: 'unknown' },
    };
    await request(app).post(`/aggregation/scoring_analysis_completed`).send(cmd).expect(401);
  });

  it('Should throw bad request', async () => {
    const userId = 'azekamzlk';
    const creditDecisioningUserId = 'zaheiuazehiuaz';
    await createUser(container, userId);
    await container.get(MongoDbUserRepository).update(userId, { creditDecisioningUserId });
    const cmd = {
      subscription: {
        disableRecovery: true,
        status: 'ACTIVE',
        subscriberId: 'subscriberIdTest',
        target: 'BASE_URL/aggregation/scoring_analysis_completed',
        eventName: 'wrong_event_name',
        id: 'test',
      },
      payload: { banksUserId: creditDecisioningUserId },
    };
    await request(app).post(`/aggregation/scoring_analysis_completed`).send(cmd).expect(400);
  });

  it('Should return 200', async () => {
    const userId = 'bNraYMPXl';
    await createUser(container, userId);
    await getAggregatedAccounts(container, userId);
    await container.get(UploadUserDataToCreditDecisioningPartner).execute({ userId });
    const user = await container.get(MongoDbUserRepository).findBy({ userId });
    const cmd = {
      subscription: {
        disableRecovery: true,
        status: 'ACTIVE',
        subscriberId: 'subscriberIdTest',
        target: 'BASE_URL/aggregation/scoring_analysis_completed',
        eventName: 'aden_analysis_completed',
        id: 'test',
      },
      payload: { banksUserId: user.props.creditDecisioningUserId },
    };
    await request(app).post(`/aggregation/scoring_analysis_completed`).send(cmd).expect(200);
    await container.get(DeleteUser).execute({ userId });
  });
});
