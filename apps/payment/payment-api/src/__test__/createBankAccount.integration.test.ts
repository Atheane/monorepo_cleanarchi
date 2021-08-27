/* eslint-disable import/order */
import 'reflect-metadata';
import { naruto } from './fixtures/config/naruto';
import { getServiceHolderIdentity } from '@oney/identity-adapters';
import { EncodeIdentity, IdentityProvider, ServiceName } from '@oney/identity-core';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';
import {
  bodyCreateSmoneyAccount,
  profileInfo,
  smoneyCreateAccountReply,
} from './fixtures/smoneyAccount/createBankAccountMock';
import { DiligencesType, UncappingState } from '@oney/payment-core';

const app: Application = express();

const smoneyScope = nock('https://sb-api.xpollens.com/api/V1.1');

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
            receiveMessages: jest.fn().mockReturnValue([]),
          }),
        }),
      }),
    },
  };
});

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        listBlobsFlat: jest.fn().mockReturnValue([
          {
            name: 'kyc/toto.jpg',
          },
        ]),
        getBlobClient: jest.fn().mockReturnValue({
          download: jest.fn().mockReturnValue({
            readableStreamBody: new Uint8Array(naruto[0] as any),
          }),
        }),
      }),
    }),
  },
}));

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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyAccount`);

describe('User Bank Account api testing', () => {
  let serviceHolderIdentity: string;
  let container: Container;
  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessTokenForCreateUser.json', { before });
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
    serviceHolderIdentity = await getServiceHolderIdentity(container, ServiceName.profile);
    nockDone();
  });

  it('Should create a bank account', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);

    /* ToDo: replace by nockBack */
    const scope = nock('http://localhost:3022').get('/profile/user/zARoItBES').reply(200, profileInfo);

    smoneyScope.post('/users', bodyCreateSmoneyAccount).reply(201, smoneyCreateAccountReply);

    // WHEN
    await request(app)
      .post('/payment/user/zARoItBES')
      .set('Authorization', `Bearer ${serviceHolderIdentity}`)
      .send({
        city: 'Créteil',
        country: 'FR',
        street: '5 rue paul cezanne',
        additionalStreet: 'appartement 00',
        zipCode: '94000',
      })
      .expect(201)
      .expect(response => {
        expect(response.body).toEqual({
          bankAccountId: '3914',
          beneficiaries: [],
          bic: 'BACCFR23XXX',
          cards: [],
          debts: [],
          iban: 'FR0512869000020PC0000030Q63',
          uid: 'zARoItBES',
          kycDiligenceStatus: 'TODO',
          kycDiligenceValidationMethod: DiligencesType.UNKNOWN,
          uncappingState: UncappingState.CAPPED,
          isUncapped: false,
          limits: {
            balanceLimit: 0,
            technicalLimit: 0,
            globalIn: {
              annualAllowance: 0,
              monthlyAllowance: 0,
              weeklyAllowance: 0,
            },
            globalOut: {
              annualAllowance: 0,
              monthlyAllowance: 0,
              weeklyAllowance: 0,
            },
          },
          productsEligibility: {
            account: false,
            splitPayment: true,
          },
          monthlyAllowance: {
            authorizedAllowance: 0,
            remainingFundToSpend: 0,
            spentFunds: 0,
          },
        });
      });

    await scope.done();
    await smoneyScope.done();
  });

  it('Should get a 401 cause odb user is not authorize to access this endpoint', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
    const encodeIdentity = await container.get(EncodeIdentity);
    const userToken = await encodeIdentity.execute({
      email: 'azoekz@zeok.com',
      provider: IdentityProvider.odb,
      uid: 'zARoItBES',
    });

    // WHEN
    await request(app)
      .post('/payment/user/zARoItBES')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        city: 'Créteil',
        country: 'FR',
        street: '5 rue paul cezanne',
        zipCode: '94000',
      })
      .expect(401);
  });
});
