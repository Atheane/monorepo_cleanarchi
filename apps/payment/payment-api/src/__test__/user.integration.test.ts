/* eslint-disable import/order */
import 'reflect-metadata';
import { naruto } from './fixtures/config/naruto';
import { EncodeIdentity, IdentityProvider, ServiceName } from '@oney/identity-core';
import { BankAccountRepositoryWrite, PaymentIdentifier } from '@oney/payment-core';
import { Application } from 'express';
import * as express from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';
import {
  expectedBankAccount,
  expectedBankAccountWithOptionalFieldsUnfilled,
  mockedBankAccount,
  mockedBankAccountWithOptionalFieldsUnfilled,
} from './fixtures/user/mockedBankAccount';
import { mockedSmoneyUserAccount } from './fixtures/user/mockedSmoneyUserAccount';

let container = new Container();
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
nockBack.setMode('record');

describe('User integration api testing', () => {
  let encodeIdentity: EncodeIdentity;
  let userId;
  let userBalance: number;

  beforeAll(async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const { nockDone } = await nockBack('getAccessToken.json', { before });
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
    encodeIdentity = container.get(EncodeIdentity);
    userId = 'ow_KFDTZq';
    userBalance = 1234;
    nockDone();
  });

  beforeEach(async () => {
    await container
      .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
      .save(mockedBankAccount);
  });

  describe('Get account balance', () => {
    it('Should get user account balance', async () => {
      nock.enableNetConnect(/127\.0\.0\.1/);
      nock('https://sb-api.xpollens.com')
        .get(`/api/V1.1/users/${userId}`)
        .reply(200, mockedSmoneyUserAccount);
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'azeae',
        uid: userId,
      });

      // WHEN
      await request(app)
        .get(`/payment/user/${userId}/balance`)
        .set('authorization', 'Bearer ' + userToken)
        .expect(200)
        .expect(response => {
          expect(response.body.balance).toEqual(userBalance);
        });
    });
  });

  describe('Update account', () => {
    it('Should update the bank account', async () => {
      const { nockDone } = await nockBack('updateAccount.json', { before });
      nock.enableNetConnect(/127\.0\.0\.1/);

      // WHEN
      await request(app)
        .patch('/payment/user/ow_KFDTZq')
        .set('authorization', 'malaika:supersecret')
        .send({
          phone: '33798563258',
        })
        .expect(200);
      await nockDone();
    });

    it('Should update the bank account with fatca', async () => {
      const { nockDone } = await nockBack('updateAccountWithFatca.json', { before });
      nock.enableNetConnect(/127\.0\.0\.1/);

      // WHEN
      await request(app)
        .patch('/payment/user/ow_KFDTZq')
        .set('authorization', 'malaika:supersecret')
        .send({
          phone: '33798563258',
          fiscalReference: { country: 'FR', tin: '123456' },
        })
        .expect(200);
      await nockDone();
    });

    it('Should update the bank account with declarative fiscal situation', async () => {
      const { nockDone } = await nockBack('updateAccountWithDeclarative.json', { before });
      nock.enableNetConnect(/127\.0\.0\.1/);

      // WHEN
      await request(app)
        .patch('/payment/user/ow_KFDTZq')
        .set('authorization', 'malaika:supersecret')
        .send({
          declarativeFiscalSituation: { income: '1', economicActivity: '11' },
        })
        .expect(200);
      await nockDone();
    });

    it('Should update the bank account with phone only', async () => {
      const { nockDone } = await nockBack('updatePartialAccountPhone.json', { before });
      nock.enableNetConnect(/127\.0\.0\.1/);

      // WHEN
      await request(app)
        .patch('/payment/user/ow_KFDTZq')
        .set('authorization', 'malaika:supersecret')
        .send({
          phone: '33798563258',
        })
        .expect(200);
      await nockDone();
    });

    it('Should fail if basic auth is not fulfilled', async () => {
      const { nockDone } = await nockBack('updatePartialAccountEconomicActivity.json', { before });
      nock.enableNetConnect(/127\.0\.0\.1/);

      // WHEN
      await request(app)
        .patch('/payment/user/ow_KFDTZq')
        .send({
          economicActivity: 11,
        })
        .expect(401);
      await nockDone();
    });
  });

  describe('GET user/[id]/bankaccount', () => {
    it('Should get user bank account that has all properties filled (include optionals)', async () => {
      nock.enableNetConnect(/127\.0\.0\.1/);

      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'azeae',
        uid: mockedBankAccount.props.uid,
      });

      // WHEN
      await request(app)
        .get(`/payment/user/${mockedBankAccount.props.uid}/bankaccount`)
        .set('authorization', 'Bearer ' + userToken)
        .expect(200)
        .expect(response => {
          expect(response.body).toEqual(expectedBankAccount);
        });
    });

    it('Should get user bank account that has some optional properties unfilled (', async () => {
      nock.enableNetConnect(/127\.0\.0\.1/);

      const mockedBankAccountSaved = await container
        .get<BankAccountRepositoryWrite>(PaymentIdentifier.bankAccountRepositoryWrite)
        .save(mockedBankAccountWithOptionalFieldsUnfilled);

      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'azeae',
        uid: mockedBankAccountSaved.props.uid,
      });

      await request(app)
        .get(`/payment/user/${mockedBankAccountSaved.props.uid}/bankaccount`)
        .set('authorization', 'Bearer ' + userToken)
        .expect(200)
        .expect(response => {
          expect(response.body).toEqual(expectedBankAccountWithOptionalFieldsUnfilled);
        });
    });

    it('Should return 404 because bank account does not exist', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'azeae',
        uid: 'WrongId',
      });

      // WHEN
      await request(app)
        .get(`/payment/user/WrongId/bankaccount`)
        .set('authorization', 'Bearer ' + userToken)
        .expect(404)
        .expect(response => {
          expect(response.body.error).toEqual('BankAccountNotFound');
        });
    });

    it('Should return 401 because user is not authorized to access this resource', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'azeae',
        uid: 'WrongId',
      });

      // WHEN
      await request(app)
        .get(`/payment/user/${mockedBankAccount.props.uid}/bankaccount`)
        .set('authorization', 'Bearer ' + userToken)
        .expect(401);
    });

    it('Should get user bank account when requested by profile service', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'profile@profile.co',
        providerId: ServiceName.profile,
        uid: ServiceName.profile,
      });

      await request(app)
        .get(`/payment/user/${mockedBankAccount.props.uid}/bankaccount`)
        .set('authorization', 'Bearer ' + userToken)
        .expect(200)
        .expect(response => {
          expect(response.body).toEqual(expectedBankAccount);
        });
    });
  });

  describe('GET user/[id]/bis', () => {
    it('Should get user bank identity statement', async () => {
      nock.enableNetConnect(/127\.0\.0\.1/);

      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'azeae',
        uid: mockedBankAccount.props.uid,
      });

      // WHEN
      await request(app)
        .get(`/payment/user/${mockedBankAccount.props.uid}/bis`)
        .set('authorization', 'Bearer ' + userToken)
        .expect(200)
        .expect(response => {
          expect(response.body instanceof Buffer).toBeTruthy();
        });
    });

    it('Should reject without a token', async () => {
      nock.enableNetConnect(/127\.0\.0\.1/);

      await request(app).get(`/payment/user/${mockedBankAccount.props.uid}/bis`).expect(401);
    });
  });
});
