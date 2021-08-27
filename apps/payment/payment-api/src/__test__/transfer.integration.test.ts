/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { PaymentIdentifier, WriteService } from '@oney/payment-core';
import { Application } from 'express';
import * as express from 'express';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';
import { senderBankAccount, beneficiaryBankAccount } from './fixtures/smoneyTransfer/bankAccount.fixtures';

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
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyTransfer`);
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

describe('Transfer integration api testing', () => {
  let writeService: WriteService;
  let encodeIdentity: EncodeIdentity;
  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessTokenForCreateUser.json', { before });
    const envPath = path.resolve(__dirname + '/env/test.env');
    const container = await bootstrap(app, envPath, process.env.MONGO_URL);

    writeService = container.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    encodeIdentity = container.get(EncodeIdentity);
    await writeService.upsert({ uid: senderBankAccount.uid }, senderBankAccount);
    await writeService.upsert({ iban: beneficiaryBankAccount.iban }, beneficiaryBankAccount);
    nockDone();
  });

  it('Should Received 401 on authenticated request', async () => {
    const payload = {
      amount: 20,
      userId: '_lHXbttPN',
      beneficiaryId: '3067',
      message: 'aze',
      recurrency: null,
      executionDate: new Date('10-09-2021'),
    };

    // WHEN
    await request(app)
      .post('/payment/transfer/' + payload.userId)
      .send(payload)
      .expect(401);
  });

  it('Should send a transfer', async () => {
    const { nockDone } = await nockBack('sct_p2p.json', { before });
    const userToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email: 'azeae',
      uid: '_lHXbttPN',
    });
    const payload = {
      frequencyType: 0,
      executionDate: new Date('10-09-2021'),
      bankAccountId: '5846',
      amount: 20,
      message: 'aze',
      motif: 'azezae',
    };

    // WHEN
    await request(app)
      .post('/payment/transfer/_lHXbttPN')
      .set('authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(201)
      .expect(response => {
        expect(response.body.amount).toEqual(20);
        expect(response.body.beneficiary.id).toEqual('5846');
      });
    nockDone();
  });

  it('Should send a transfer with recurrency', async () => {
    const { nockDone } = await nockBack('sct_recurrent.json', { before });
    const userToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email: 'azeae',
      uid: '_lHXbttPN',
    });
    const payload = {
      frequencyType: 1,
      executionDate: new Date('10-09-2021'),
      bankAccountId: '3067',
      amount: 20,
      message: 'aze',
      motif: 'azezae',
      recurrentEndDate: new Date('11-11-2021'),
    };

    // WHEN
    await request(app)
      .post('/payment/transfer/_lHXbttPN')
      .set('authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(201)
      .expect(response => {
        expect(response.body.amount).toEqual(20);
      });
    await nockDone();
  });

  it('Should get a 401 cause user try to make transfer with another userId', async () => {
    const userToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email: 'azeae',
      uid: 'kTDhDRrHv',
    });
    const payload = {
      frequencyType: 1,
      executionDate: new Date('10-09-2021'),
      bankAccountId: '1439',
      amount: 20,
      message: 'aze',
      motif: 'azezae',
      recurrentEndDate: new Date('11-11-2021'),
    };

    // WHEN
    await request(app)
      .post('/payment/transfer/azdazdzad')
      .set('authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(401);
  });
});
