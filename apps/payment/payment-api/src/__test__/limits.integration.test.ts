import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { PaymentIdentifier, WriteService } from '@oney/payment-core';
import { Application } from 'express';
import * as express from 'express';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';
import { kvConfiguration } from './fixtures/config/Configuration';

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
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyCards`);

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

describe('Limits integration api', () => {
  let writeService: WriteService;
  let encodeIdentity: EncodeIdentity;

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessTokenForCreateUser.json', { before });

    const envPath = path.resolve(__dirname + '/env/test.env');
    const container = await bootstrap(app, envPath, process.env.MONGO_URL);

    const mockyBankAccount = {
      _id: '5z7c6ff44d0bca0013e5d982',
      uid: 'zCDOH_UvA',
      bid: '2520',
      iban: 'FR0612869000020PC000001Y059',
      bic: 'SMOEFRP1',
      cards: [],
      beneficiaries: [],
    };
    writeService = container.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    encodeIdentity = container.get(EncodeIdentity);
    await writeService.upsert({ iban: mockyBankAccount.iban }, mockyBankAccount);
    nockDone();
  });

  beforeEach(() => {
    nock(kvConfiguration.smoneyConfiguration.getTokenUrl)
      .post(
        '/connect/token',
        'client_id=Oney.Test&client_secret=Oney.Test&grant_type=client_credentials&scope=partner',
      )
      .reply(200, {
        access_token:
          'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc4Q0QwNDc2MDM2RUQxMDAwMEQzNjRFNEJCQzQ2RjE2NzFFNkIzNDJSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6ImVNMEVkZ051MFFBQTAyVGt1OFJ2Rm5IbXMwSSJ9.eyJuYmYiOjE2MDc1MDg5MzAsImV4cCI6MTYwNzUxMjUzMCwiaXNzIjoiaHR0cHM6Ly9zYi1jb25uZWN0Lnhwb2xsZW5zLmNvbSIsImF1ZCI6IkFQSS5HYXRld2F5IiwiY2xpZW50X2lkIjoiT25leS5UZXN0IiwicGFydG5lcl9jb2RlIjoib25leSIsImp0aSI6IjVBQjY2RjQwOEUwRjc2MTAzMEIzQ0RBMzM4NERBQTE2IiwiaWF0IjoxNjA3NTA4OTMwLCJzY29wZSI6WyJwYXJ0bmVyIl19.MduL-iR6yGB3P5XF067yGRGpK_4vu9UwQzrM0NOfyhLV65hRAY3A0mwYkfHOWUD-p5RtIwVLAiP0qaNZ6E7_d7DWFtOn8wJIU3ftCZuvg3GXu1QVC-Hot-tavbXMspJ_c6cE9-S4IuaT1JdsnvEsy5oC7ChGZhDnj3CEguOGxeZt5QDpJfdH0UqzfYFHGb7kkcEKlJwoa2RBGNnFTM_srrmd8-74jQXktOKcb-tdSkAbdZochRJa578sn1NL6mw0TlSUpoBfloWyDg65fUPyStfq_UIfzCaYgv7SfXEPMcGo5pV_HDbnlgi_IqaKJgEJYGutf-eWvqXh__hhzIDXBg',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'partner',
      });
  });

  it('Should return a bankAccount with a 200 code', async () => {
    const { nockDone } = await nockBack('getUncapedLimits.json', { before });
    const userToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email: 'azeae',
      uid: 'zCDOH_UvA',
    });

    // WHEN
    await request(app)
      .post('/payment/account/zCDOH_UvA/limits/raising-order')
      .set('authorization', 'Bearer ' + userToken)
      .send({ uid: 'zCDOH_UvA' })
      .expect(200);

    nockDone();
  });
});
