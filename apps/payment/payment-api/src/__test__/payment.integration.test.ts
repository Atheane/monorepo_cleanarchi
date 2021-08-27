/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { PaymentIdentifier, Recurrency, TransferFrequencyType, WriteService } from '@oney/payment-core';
import { Application } from 'express';
import * as express from 'express';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';

const app: Application = express();

jest.mock('@azure/service-bus', () => {
  return {
    ReceiveMode: {
      peekLock: 1,
      receiveAndDelete: 2,
    },
    ServiceBusClient: {
      createFromConnectionString: jest.fn().mockReturnValue({
        name: 'AzureBus',
        createTopicClient: jest.fn().mockReturnValue({
          createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
          }),
        }),
        createSubscriptionClient: jest.fn().mockReturnValue({
          addRule: jest.fn(),
          createReceiver: jest.fn().mockReturnValue({
            registerMessageHandler: jest.fn(),
            receiveMessages: jest.fn().mockReturnValue([
              {
                body: JSON.stringify({
                  eventName: 'ORDER_CREATED',
                }),
                complete: jest.fn(),
              },
              {
                body: JSON.stringify({
                  eventName: 'ORDER_UPDATED',
                }),
                complete: jest.fn(),
              },
            ]),
          }),
        }),
      }),
    },
  };
});

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyPayments`);

const before = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => {
    const { of: currentOffset } = queryString.parse(`?${body}`);
    const { of: recordedOffset } = queryString.parse(`?${body}`);
    if (!(currentOffset || recordedOffset)) {
      // Just replace the saved body by a new one
      // eslint-disable-next-line no-param-reassign
      delete aRecordedBody.orderid;
      return aRecordedBody;
    }
    if (currentOffset === recordedOffset) {
      return aRecordedBody;
    }
    return body;
  };
};

describe('Payment integration api testing', () => {
  let writeService: WriteService;
  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessTokenForCreateUser.json', { before });

    const envPath = path.resolve(__dirname + '/env/test.env');
    const container = await bootstrap(app, envPath, process.env.MONGO_URL);

    const mockyBankAccount = {
      _id: '5f606c39d6a9980011db3052',
      uid: '_lHXbttPN',
      bid: '454',
      iban: 'FR4512869000020P0000000CM62',
      bic: 'SMOEFRP1',
      cards: [
        {
          _id: '5f773cb7ae9a7400113a1370',
          cid: 'card-h6tK2H5NI',
          pan: '4396XXXXXXXX9103',
          status: 1,
          cardType: 2,
          blocked: false,
          foreignPayment: true,
          internetPayment: true,
          atmWeeklyAllowance: 2.5,
          atmWeeklyUsedAllowance: 0,
          monthlyAllowance: 3,
          monthlyUsedAllowance: 0,
        },
      ],
      beneficiaries: [],
      __v: 9,
    };
    writeService = container.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    await writeService.upsert({ iban: mockyBankAccount.iban }, mockyBankAccount);
    await nockDone();
  });

  it('Should Process a payment', async () => {
    const { nockDone } = await nockBack('payment.json', { before });

    const payload = {
      contractNumber: 'XMp6548787',
      amount: 77,
      senderId: 'mala_2',
      ref: 1,
      message: 'aze',
      recurency: new Recurrency({
        frequencyType: TransferFrequencyType.WEEKLY,
        endRecurrency: new Date('2020-10-20'),
      }),
    };

    await request(app)
      .post('/payment/p2p')
      .set('authorization', 'Basic bWFsYWlrYTpzdXBlcnNlY3JldA==')
      .send(payload)
      .expect(response => {
        expect(response.body.amount).toEqual(77);
        expect(typeof response.body.id).toBe('string');
        expect(response.body.id).toEqual(response.body.orderId);
      })
      .expect(201);
    nockDone();
  });

  it('Should Process a payment with custom predefined orderId', async () => {
    const { nockDone } = await nockBack('payment.json', { before });

    const payload = {
      contractNumber: 'XMp6548787',
      amount: 77,
      senderId: 'mala_2',
      ref: 1,
      message: 'aze',
      recurency: new Recurrency({
        frequencyType: TransferFrequencyType.WEEKLY,
        endRecurrency: new Date('2020-10-20'),
      }),
      orderId: 'customOrderIdPredefined',
    };

    await request(app)
      .post('/payment/p2p')
      .set('authorization', 'Basic bWFsYWlrYTpzdXBlcnNlY3JldA==')
      .send(payload)
      .expect(response => {
        expect(response.body.orderId).toEqual('customOrderIdPredefined');
        expect(response.body.amount).toEqual(77);
      })
      .expect(201);
    nockDone();
  });

  it('Should Process a payment and throw an api error cause OrderId already used', async () => {
    const { nockDone } = await nockBack('apiError.json', { before });

    const payload = {
      contractNumber: 'XMp6548787',
      amount: 77,
      senderId: 'mala_2',
      ref: 1,
      message: 'aze',
      recurency: new Recurrency({
        frequencyType: TransferFrequencyType.WEEKLY,
        endRecurrency: new Date('2020-10-20'),
      }),
      orderId: 'customOrderIdPredefined',
    };

    await request(app)
      .post('/payment/p2p')
      .set('authorization', 'Basic bWFsYWlrYTpzdXBlcnNlY3JldA==')
      .send(payload)
      .expect(500);
    nockDone();
  });

  it('Should receive a 403 cause authkey not valid', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);

    await request(app).post('/payment/p2p').set('authorization', 'Basic badtoken').expect(403);
  });

  it('Should receive a 403 cause authkey is missing', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);

    await request(app).post('/payment/p2p').expect(401);
  });
});
