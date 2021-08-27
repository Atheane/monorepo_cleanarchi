/* eslint-disable import/order */
import 'reflect-metadata';
import { naruto } from './fixtures/config/naruto';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';
import { addBeneficiaryMockBankAccount } from './fixtures/smoneyBeneficiaries/beneficiaries.fixtures';
import { PaymentIdentifier, WriteService } from '@oney/payment-core';

const app: Application = express();
const nockBack = nock.back;

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

describe('INTEGRATION - BeneficiaryApi', () => {
  let container: Container;
  let saveFixture: Function;
  let encodeIdentity: EncodeIdentity;
  let writeService: WriteService;

  beforeAll(async () => {
    nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyBeneficiaries`);
    nockBack.setMode('record');
    const { nockDone } = await nockBack('getAccessToken.json', { before });
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
    encodeIdentity = container.get(EncodeIdentity);
    writeService = container.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
    await writeService.upsert({ uid: addBeneficiaryMockBankAccount.uid }, addBeneficiaryMockBankAccount);
    nockDone();
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    /**
     * nock back available modes:
     * - wild: all requests go out to the internet, don't replay anything, doesn't record anything
     * - dryrun: The default, use recorded nocks, allow http calls, doesn't record anything, useful for writing new tests
     * - record: use recorded nocks, record new nocks
     * - lockdown: use recorded nocks, disables all http calls even when not nocked, doesn't record
     * @see https://github.com/nock/nock#modes
     */
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should request SCA verifier on first call', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
    const userToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email: 'user@email.com',
      uid: 'UpmekTXcJ',
    });

    // WHEN
    await request(app)
      .post('/payment/user/UpmekTXcJ/beneficiary')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        bic: 'BACCFR23XXX',
        name: 'Beneficiary guy',
        email: 'lagrossemoula@yopmail.com',
        iban: 'FR7812869000020PC000005NM04',
      })
      .expect(403)
      .expect(response => {
        expect(response.body).toEqual({
          verifierId: 'CtxDACVERec44315a10f54a979be006c01ef1132722',
          action: {
            type: 'ADD_BENEFICIARY',
            payload:
              'eyJ1aWQiOiJVcG1la1RYY0oiLCJiaWMiOiJCQUNDRlIyM1hYWCIsIm5hbWUiOiJCZW5lZmljaWFyeSBndXkiLCJlbWFpbCI6ImxhZ3Jvc3NlbW91bGFAeW9wbWFpbC5jb20iLCJpYmFuIjoiRlI3ODEyODY5MDAwMDIwUEMwMDAwMDVOTTA0In0=',
          },
          customer: {
            uid: 'UpmekTXcJ',
            email: 'zanchi102@yopmail.com',
          },
          status: 'PENDING',
          valid: false,
          factor: 'otp',
          channel: 'sms',
          expirationDate: '2021-04-26T16:31:11.623Z',
          metadatas: {
            otpLength: 8,
          },
          code: '2FA_REQUESTED',
        });
      });
  });

  it('Should create beneficiary', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
    const userToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email: 'user@email.com',
      uid: 'UpmekTXcJ',
    });

    // WHEN
    await request(app)
      .post('/payment/user/UpmekTXcJ/beneficiary')
      .set('Authorization', `Bearer ${userToken}`)
      .set(
        'sca_token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmllcklkIjoiQ3R4REFDVkVSZWM0NDMxNWExMGY1NGE5NzliZTAwNmMwMWVmMTEzMjcyMiIsImFjdGlvbiI6eyJ0eXBlIjoiQUREX0JFTkVGSUNJQVJZIiwicGF5bG9hZCI6ImV5SjFhV1FpT2lKVmNHMWxhMVJZWTBvaUxDSmlhV01pT2lKQ1FVTkRSbEl5TTFoWVdDSXNJbTVoYldVaU9pSkNaVzVsWm1samFXRnllU0JuZFhraUxDSmxiV0ZwYkNJNklteGhaM0p2YzNObGJXOTFiR0ZBZVc5d2JXRnBiQzVqYjIwaUxDSnBZbUZ1SWpvaVJsSTNPREV5T0RZNU1EQXdNREl3VUVNd01EQXdNRFZPVFRBMEluMD0ifSwiY3VzdG9tZXIiOnsidWlkIjoiVXBtZWtUWGNKIiwiZW1haWwiOiJ6YW5jaGkxMDJAeW9wbWFpbC5jb20ifSwiZmFjdG9yIjoib3RwIiwiY2hhbm5lbCI6InNtcyIsImV4cGlyYXRpb25EYXRlIjoiMjAyMS0wNC0yNlQxNjozMToxMS42MjNaIiwibWV0YWRhdGFzIjp7Im90cExlbmd0aCI6OH0sImlhdCI6MTYxOTQ1MzQ3MSwiZXhwIjoxNjE5NDUzNzcxLCJhdWQiOiJvZGJfYXV0aGVudGljYXRpb25fZGV2IiwiaXNzIjoib2RiX2F1dGhlbnRpY2F0aW9uIn0.RyaQD8bZnpkvuWgyMNzexTqvpet0T1Fe3Sl_8AAQ_gs',
      )
      .send({
        bic: 'BACCFR23XXX',
        name: 'Beneficiary guy',
        email: 'lagrossemoula@yopmail.com',
        iban: 'FR7812869000020PC000005NM04',
      })
      .expect(201)
      .expect(response => {
        expect(response.body).toEqual({
          bic: 'BAxxxxxxxXX',
          email: 'lagrossemoula@yopmail.com',
          iban: 'FR781286900002XXXXXXX05NMXX',
          id: 4091,
          name: 'Beneficiary guy',
          status: 1,
        });
      });
  });

  it('Should reject a call with no token', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);

    // WHEN
    await request(app)
      .post('/payment/user/UpmekTXcJ/beneficiary')
      .send({
        bic: 'BACCFR23XXX',
        name: 'Beneficiary guy',
        email: 'lagrossemoula@yopmail.com',
        iban: 'FR4112869000020PC000005JN24',
      })
      .expect(401);
  });
});
