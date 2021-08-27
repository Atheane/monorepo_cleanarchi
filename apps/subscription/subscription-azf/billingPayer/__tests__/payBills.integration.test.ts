/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  ActivateSubscriber,
  ActivateSubscription,
  BillSubscriptions,
  EnrollSubscriber,
  SubscribeToOffer,
} from '@oney/subscription-core';
import * as dateMock from 'jest-date-mock';
import * as moment from 'moment';
import { ConfigService } from '@oney/envs';
import { Context } from '@azure/functions';
import * as nock from 'nock';
import { MongoClient } from 'mongodb';
import * as path from 'path';
import { SubscriptionKernel } from '../config/SubscriptionKernel';
import { keyvaultConfiguration, localConfiguration } from '../config/EnvConfiguration';
import payBills from '../index';

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
    }),
  },
}));

describe('Integration - PayBill', function () {
  let container: SubscriptionKernel;
  let scope: nock.Scope;
  beforeAll(async () => {
    await new ConfigService({
      localUri: path.resolve(__dirname + '/../test.env'),
      keyvaultUri: null,
    }).loadEnv();
    container = new SubscriptionKernel(localConfiguration, keyvaultConfiguration);
    await container.initDependencies();
    scope = nock('http://dev.api');
    const connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });
    const db = await connection.db(process.env.MONGO_DB_NAME);
    await db.dropDatabase();
  });

  afterEach(() => {
    dateMock.clear();
  });

  it('Should Handle Bill Scheduled', async () => {
    scope
      .filteringRequestBody(function (path) {
        const obj = JSON.parse(path);
        delete obj.orderId;
        return obj;
      })
      .post('/payment/p2p', { amount: 2.5, message: '', recurency: null, ref: 73, senderId: 'aaa' })
      .reply(200);
    await container.get(EnrollSubscriber).execute({
      uid: 'aaa',
    });
    const result = await container.get(SubscribeToOffer).execute({
      offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
      subscriberId: 'aaa',
    });
    await container.get(ActivateSubscriber).execute({
      uid: 'aaa',
      isValidated: true,
    });
    await container.get(ActivateSubscription).execute({
      subscriptionId: result.id,
    });

    dateMock.advanceTo(moment().add(1, 'month').toDate());
    await container.get(BillSubscriptions).execute();
    const context = {
      res: {},
    } as Context;
    await payBills(context);

    // Should not reschedule billing cause nextBillingDate has been update.
    await payBills(context);
  });
});
