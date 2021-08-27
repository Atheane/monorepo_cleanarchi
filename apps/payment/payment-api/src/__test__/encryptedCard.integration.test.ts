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
import { addBeneficiaryMockBankAccount } from './fixtures/smoneyEncryptedCard/encryptedCard.fixtures';
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

describe('INTEGRATION - EncryptionCardApi', () => {
  let container: Container;
  let saveFixture: Function;
  let encodeIdentity: EncodeIdentity;
  let writeService: WriteService;
  let rsaPublicKey: string;

  beforeAll(async () => {
    rsaPublicKey =
      'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUE1YnQ3UzZvSy9kNldNdUZvQk9SNktKcnJyc1oxRWhtR3VIMnRMMkc4T1d6UmY4L1ltaHRxY3NXQWxIU3pQRHJUeDdxbktVUWRObFVHN1hGVEswanZoWnduazVpcVh6WEJsSElaakFHTklLcXFOcG5KSkt6SHYreUhPNGdFY3dEQVFtZUdSbVNkMVRkcGlhKzlSNUtKOEJsMFZPUSttb3FBTjhQL1ZnQUFla2d0U3ZqbHl1UURjTm9qVEFZVEp0RjRkYnR4YldJcHM3U3FPckFNUFJySmNGeUs5dzFSVUxKeElIQnFFdzJQYTRVVldFeUE0djRmYm44VGlNcjNpOU9MZURFdERnZElOLys5aHduRng2Wm5nZnBEK3IrQ210WS9yY0ljYUZBYWN3emJFaDBDdERCL1loVUh2c3lUeXU3SjZYN0xzaFU5dVdkMUJEWWwvNUwxK3o2QnRaQjgvaUtQT1lpMHNNM2tRZDNWUWh1QXFHaXJpOUZVZGNmeVNMM2NSRlc4di9Ma0tYL1JWL29NOW5RNmpNajZmd0pIcmdGYnNybU9JQVhyNXV4ZWxkUExJTlB2RVplRFBpVEx4TnlodUkyN1lMYnZZNFllbmtoek93ZkRSOS82dEFkWFJDSitraVBTUXUwa1hvbjByY1o5WlkxY1FZWDlUSUg2MUxJUnJMWEpHdGFuL1BYVnpnY1IvVXlGUXFXamJJVlIvZFVVdi9mUzRwWFUrUEp3TUNzdWZsQXlwbTFpOEJwVk5zejA1amw4RlV6T1ZQNUFUeTdQNkZNNlA0d1NjRHphWnpCaVkvSFU2Nm9mbVZJQ2p2M0d3dHkxTnYrVnhUdTQwSUsyZmo4NzZvNHduNU5Ma0swMCtFUEVZYjFrYUFvRExkV290dnNhOU9QdHdpRUNBd0VBQVE9PQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=';
    nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyEncryptedCard`);
    nockBack.setMode('record');
    const { nockDone } = await nockBack('getAccessToken.json', { before });
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
    encodeIdentity = container.get(EncodeIdentity);
    writeService = container.get<WriteService>(PaymentIdentifier.accountManagementWriteService);
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
    await writeService.upsert({ uid: addBeneficiaryMockBankAccount.uid }, addBeneficiaryMockBankAccount);
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
  });

  afterEach(async () => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
    await writeService.clear();
  });

  describe('Display Card Pin', () => {
    it('Should request SCA verifier on first call', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'user@email.com',
        uid: 'UpmekTXcJ',
      });

      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/displaypin')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          rsaPublicKey,
        })
        .expect(403)
        .expect(response => {
          expect(response.body).toEqual({
            verifierId: 'DibFqmkuo',
            action: {
              type: 'DISPLAY_CARD_PIN',
              payload:
                'eyJ1aWQiOiJVcG1la1RYY0oiLCJjYXJkSWQiOiJjYXJkLUJHQnBDeGpaTyIsInJzYVB1YmxpY0tleSI6IkxTMHRMUzFDUlVkSlRpQlFWVUpNU1VNZ1MwVlpMUzB0TFMwS1RVbEpRMGxxUVU1Q1oydHhhR3RwUnpsM01FSkJVVVZHUVVGUFEwRm5PRUZOU1VsRFEyZExRMEZuUlVFMVluUTNVelp2U3k5a05sZE5kVVp2UWs5U05rdEtjbkp5YzFveFJXaHRSM1ZJTW5STU1rYzRUMWQ2VW1ZNEwxbHRhSFJ4WTNOWFFXeElVM3BRUkhKVWVEZHhia3RWVVdST2JGVkhOMWhHVkVzd2FuWm9XbmR1YXpWcGNWaDZXRUpzU0VsYWFrRkhUa2xMY1hGT2NHNUtTa3Q2U0hZcmVVaFBOR2RGWTNkRVFWRnRaVWRTYlZOa01WUmtjR2xoS3psU05VdEtPRUpzTUZaUFVTdHRiM0ZCVGpoUUwxWm5RVUZsYTJkMFUzWnFiSGwxVVVSalRtOXFWRUZaVkVwMFJqUmtZblI0WWxkSmNITTNVM0ZQY2tGTlVGSnlTbU5HZVVzNWR6RlNWVXhLZUVsSVFuRkZkekpRWVRSVlZsZEZlVUUwZGpSbVltNDRWR2xOY2pOcE9VOU1aVVJGZEVSblpFbE9MeXM1YUhkdVJuZzJXbTVuWm5CRUszSXJRMjEwV1M5eVkwbGpZVVpCWVdOM2VtSkZhREJEZEVSQ0wxbG9WVWgyYzNsVWVYVTNTalpZTjB4emFGVTVkVmRrTVVKRVdXd3ZOVXd4SzNvMlFuUmFRamd2YVV0UVQxbHBNSE5OTTJ0UlpETldVV2gxUVhGSGFYSnBPVVpWWkdObWVWTk1NMk5TUmxjNGRpOU1hMHRZTDFKV0wyOU5PVzVSTm1wTmFqWm1kMHBJY21kR1luTnliVTlKUVZoeU5YVjRaV3hrVUV4SlRsQjJSVnBsUkZCcFZFeDRUbmxvZFVreU4xbE1ZblpaTkZsbGJtdG9lazkzWmtSU09TODJkRUZrV0ZKRFNpdHJhVkJUVVhVd2ExaHZiakJ5WTFvNVdsa3hZMUZaV0RsVVNVZzJNVXhKVW5KTVdFcEhkR0Z1TDFCWVZucG5ZMUl2VlhsR1VYRlhhbUpKVmxJdlpGVlZkaTltVXpSd1dGVXJVRXAzVFVOemRXWnNRWGx3YlRGcE9FSndWazV6ZWpBMWFtdzRSbFY2VDFaUU5VRlVlVGRRTmtaTk5sQTBkMU5qUkhwaFducENhVmt2U0ZVMk5tOW1iVlpKUTJwMk0wZDNkSGt4VG5ZclZuaFVkVFF3U1VzeVptbzROelp2TkhkdU5VNU1hMHN3TUN0RlVFVlpZakZyWVVGdlJFeGtWMjkwZG5OaE9VOVFkSGRwUlVOQmQwVkJRVkU5UFFvdExTMHRMVVZPUkNCUVZVSk1TVU1nUzBWWkxTMHRMUzA9In0=',
            },
            customer: {
              uid: 'UpmekTXcJ',
              email: 'zanchi102@yopmail.com',
            },
            status: 'PENDING',
            valid: false,
            factor: 'otp',
            channel: 'email',
            expirationDate: '2021-04-27T08:50:36.603Z',
            metadatas: {},
            code: '2FA_REQUESTED',
          });
        });
    });

    it('Should get encrypted card pin', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'user@email.com',
        uid: 'UpmekTXcJ',
      });

      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/displaypin')
        .set('Authorization', `Bearer ${userToken}`)
        .set(
          'sca_token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmllcklkIjoiRGliRnFta3VvIiwiYWN0aW9uIjp7InR5cGUiOiJESVNQTEFZX0NBUkRfUElOIiwicGF5bG9hZCI6ImV5SjFhV1FpT2lKVmNHMWxhMVJZWTBvaUxDSmpZWEprU1dRaU9pSmpZWEprTFVKSFFuQkRlR3BhVHlJc0luSnpZVkIxWW14cFkwdGxlU0k2SWt4VE1IUk1VekZEVWxWa1NsUnBRbEZXVlVwTlUxVk5aMU13VmxwTVV6QjBURk13UzFSVmJFcFJNR3h4VVZVMVExb3lkSGhoUjNSd1VucHNNMDFGU2tKVlZWWkhVVlZHVUZFd1JtNVBSVVpPVTFWc1JGRXlaRXhSTUVadVVsVkZNVmx1VVROVmVscDJVM2s1YTA1c1pFNWtWVnAyVVdzNVUwNXJkRXRqYmtwNVl6RnZlRkpYYUhSU00xWkpUVzVTVFUxcll6UlVNV1EyVlcxWk5Fd3hiSFJoU0ZKNFdUTk9XRkZYZUVsVk0zQlJVa2hLVldWRVpIaGlhM1JXVlZkU1QySkdWa2hPTVdoSFZrVnpkMkZ1V205WGJtUjFZWHBXY0dOV2FEWlhSVXB6VTBWc1lXRnJSa2hVYTJ4TVkxaEdUMk5ITlV0VGEzUTJVMGhaY21WVmFGQk9SMlJHV1ROa1JWRldSblJhVldSVFlsWk9hMDFXVW10alIyeG9TM3BzVTA1VmRFdFBSVXB6VFVaYVVGVlRkSFJpTTBaQ1ZHcG9VVXd4V201UlZVWnNZVEprTUZVelduRmlTR3d4VlZWU2FsUnRPWEZXUlVaYVZrVndNRkpxVW10WmJsSTBXV3hrU21OSVRUTlZNMFpRWTJ0R1RsVkdTbmxUYlU1SFpWVnpOV1I2UmxOV1ZYaExaVVZzU1ZGdVJrWmtla3BSV1ZSU1ZsWnNaRVpsVlVVd1pHcFNiVmx0TkRSV1IyeE9ZMnBPY0U5Vk9VMWFWVkpHWkVWU2JscEZiRTlNZVhNMVlVaGtkVkp1WnpKWGJUVnVXbTVDUlVzelNYSlJNakV3VjFNNWVWa3diR3BaVlZwQ1dWZE9NMlZ0U2taaFJFSkVaRVZTUTB3eGJHOVdWV2d5WXpOc1ZXVllWVE5UYWxwWlRqQjRlbUZHVlRWa1ZtUnJUVlZLUlZkWGQzWk9WWGQ0U3pOdk1sRnVVbUZSYW1kMllWVjBVVlF4YkhCTlNFNU9UVEowVWxwRVRsZFZWMmd4VVZoR1NHRllTbkJQVlZwV1drZE9iV1ZXVGsxTk1rNVRVbXhqTkdScE9VMWhNSFJaVERGS1Ywd3lPVTVQVnpWU1RtMXdUbUZxV20xa01IQkpZMjFrUjFsdVRubGlWVGxLVVZab2VVNVlWalJhVjNoclZVVjRTbFJzUWpKU1ZuQnNVa1pDY0ZaRmVEUlVibXh2WkZWcmVVNHhiRTFaYmxwYVRrWnNiR0p0ZEc5bGF6a3pXbXRTVTA5VE9ESmtSVVpyVjBaS1JGTnBkSEpoVmtKVVZWaFZkMkV4YUhaaWFrSjVXVEZ2TlZkc2EzaFpNVVphVjBSc1ZWTlZaekpOVlhoS1ZXNUtUVmRGY0Voa1IwWjFUREZDV1ZadWNHNVpNVWwyVmxoc1IxVllSbGhoYlVwS1ZteEpkbHBHVmxaa2FUbHRWWHBTZDFkR1ZYSlZSWEF6VkZWT2VtUlhXbk5SV0d4M1lsUkdjRTlGU25kV2F6VjZaV3BCTVdGdGR6UlNiRlkyVkRGYVVVNVZSbFZsVkdSUlRtdGFUazVzUVRCa01VNXFVa2h3YUZkdWNFTmhWbXQyVTBaVk1rNXRPVzFpVmxwS1VUSndNazB3WkROa1NHdDRWRzVaY2xadWFGVmtWRkYzVTFWemVWcHRielJPZWxwMlRraGtkVTVWTlUxaE1ITjNUVU4wUmxWRlZscFpha1p5V1ZWR2RsSkZlR3RXTWprd1pHNU9hRTlWT1ZGa1NHUndVbFZPUW1Rd1ZrSlJWa1U1VUZGdmRFeFRNSFJNVlZaUFVrTkNVVlpWU2sxVFZVMW5VekJXV2t4VE1IUk1VekE5SW4wPSJ9LCJjdXN0b21lciI6eyJ1aWQiOiJVcG1la1RYY0oiLCJlbWFpbCI6InphbmNoaTEwMkB5b3BtYWlsLmNvbSJ9LCJmYWN0b3IiOiJvdHAiLCJjaGFubmVsIjoiZW1haWwiLCJleHBpcmF0aW9uRGF0ZSI6IjIwMjEtMDQtMjdUMDg6NTA6MzYuNjAzWiIsImlhdCI6MTYxOTUxMzEzNiwiZXhwIjoxNjE5NTEzNDM2LCJhdWQiOiJvZGJfYXV0aGVudGljYXRpb25fZGV2IiwiaXNzIjoib2RiX2F1dGhlbnRpY2F0aW9uIn0.BB-IlayX88azgdvhUKLYu_TvYU-wz1jeiDu8IEhJgCM',
        )
        .send({
          rsaPublicKey,
        })
        .expect(200)
        .expect(response => {
          expect(response.body).toEqual({
            pinBlock: 'D5DRGj6F1po=',
            ktaKey: 'g7JDPvyJfB1QdGcXD3Inqw==',
            ktkKey:
              'WJcfDICWyhpQAl7Rzg/9sBImpWCHpA7cOHm/SbRLg4P0XF/dZEzGPX58iCg1A6I36vX6j2cA7mAksWHaA0rTHtAlSCpcm1zNeAoYC7ZiBHUOVXJjThPix2YMHUT15WCn3OrcOcqFHTOoDwRu2t+RHJTUOvzN2RiXe6lDWx0D2GW8euCs6JguucrjbwvzITs9Kf9IFG98f3lUE2eUar5QPBP9CzsVM1+Xe1mIsNSK/+QERXDOyl4tgyU035h5Ot75EglExM6ullYUBlHC9VTG5Ls7UMkRf4VZKQYSsRiNelaQt33+q7YzhHWWtIs1HAo5NLdoO0AI/iEoln7ZMOWi3g==',
          });
        });
    });

    it('Should not get encrypted card pin for a card not owned', async () => {
      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/displaypin')
        .send({
          rsaPublicKey,
        })
        .expect(401);
    });

    it('Should fail is body is missing', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'user@email.com',
        uid: 'UpmekTXcJ',
      });

      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/displaypin')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('Display Card Details', () => {
    it('Should request SCA verifier on first call', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'user@email.com',
        uid: 'UpmekTXcJ',
      });

      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/displaydetails')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          rsaPublicKey,
        })
        .expect(403)
        .expect(response => {
          expect(response.body).toEqual({
            verifierId: 'wDKapaQvT',
            action: {
              type: 'DISPLAY_CARD_DETAILS',
              payload:
                'eyJ1aWQiOiJVcG1la1RYY0oiLCJjYXJkSWQiOiJjYXJkLUJHQnBDeGpaTyIsInJzYVB1YmxpY0tleSI6IkxTMHRMUzFDUlVkSlRpQlFWVUpNU1VNZ1MwVlpMUzB0TFMwS1RVbEpRMGxxUVU1Q1oydHhhR3RwUnpsM01FSkJVVVZHUVVGUFEwRm5PRUZOU1VsRFEyZExRMEZuUlVFMVluUTNVelp2U3k5a05sZE5kVVp2UWs5U05rdEtjbkp5YzFveFJXaHRSM1ZJTW5STU1rYzRUMWQ2VW1ZNEwxbHRhSFJ4WTNOWFFXeElVM3BRUkhKVWVEZHhia3RWVVdST2JGVkhOMWhHVkVzd2FuWm9XbmR1YXpWcGNWaDZXRUpzU0VsYWFrRkhUa2xMY1hGT2NHNUtTa3Q2U0hZcmVVaFBOR2RGWTNkRVFWRnRaVWRTYlZOa01WUmtjR2xoS3psU05VdEtPRUpzTUZaUFVTdHRiM0ZCVGpoUUwxWm5RVUZsYTJkMFUzWnFiSGwxVVVSalRtOXFWRUZaVkVwMFJqUmtZblI0WWxkSmNITTNVM0ZQY2tGTlVGSnlTbU5HZVVzNWR6RlNWVXhLZUVsSVFuRkZkekpRWVRSVlZsZEZlVUUwZGpSbVltNDRWR2xOY2pOcE9VOU1aVVJGZEVSblpFbE9MeXM1YUhkdVJuZzJXbTVuWm5CRUszSXJRMjEwV1M5eVkwbGpZVVpCWVdOM2VtSkZhREJEZEVSQ0wxbG9WVWgyYzNsVWVYVTNTalpZTjB4emFGVTVkVmRrTVVKRVdXd3ZOVXd4SzNvMlFuUmFRamd2YVV0UVQxbHBNSE5OTTJ0UlpETldVV2gxUVhGSGFYSnBPVVpWWkdObWVWTk1NMk5TUmxjNGRpOU1hMHRZTDFKV0wyOU5PVzVSTm1wTmFqWm1kMHBJY21kR1luTnliVTlKUVZoeU5YVjRaV3hrVUV4SlRsQjJSVnBsUkZCcFZFeDRUbmxvZFVreU4xbE1ZblpaTkZsbGJtdG9lazkzWmtSU09TODJkRUZrV0ZKRFNpdHJhVkJUVVhVd2ExaHZiakJ5WTFvNVdsa3hZMUZaV0RsVVNVZzJNVXhKVW5KTVdFcEhkR0Z1TDFCWVZucG5ZMUl2VlhsR1VYRlhhbUpKVmxJdlpGVlZkaTltVXpSd1dGVXJVRXAzVFVOemRXWnNRWGx3YlRGcE9FSndWazV6ZWpBMWFtdzRSbFY2VDFaUU5VRlVlVGRRTmtaTk5sQTBkMU5qUkhwaFducENhVmt2U0ZVMk5tOW1iVlpKUTJwMk0wZDNkSGt4VG5ZclZuaFVkVFF3U1VzeVptbzROelp2TkhkdU5VNU1hMHN3TUN0RlVFVlpZakZyWVVGdlJFeGtWMjkwZG5OaE9VOVFkSGRwUlVOQmQwVkJRVkU5UFFvdExTMHRMVVZPUkNCUVZVSk1TVU1nUzBWWkxTMHRMUzA9In0=',
            },
            customer: {
              uid: 'UpmekTXcJ',
              email: 'zanchi102@yopmail.com',
            },
            status: 'PENDING',
            valid: false,
            factor: 'otp',
            channel: 'email',
            expirationDate: '2021-04-27T08:54:01.265Z',
            metadatas: {},
            code: '2FA_REQUESTED',
          });
        });
    });

    it('Should get encrypted card details', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'user@email.com',
        uid: 'UpmekTXcJ',
      });

      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/displaydetails')
        .set('Authorization', `Bearer ${userToken}`)
        .set(
          'sca_token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmllcklkIjoid0RLYXBhUXZUIiwiYWN0aW9uIjp7InR5cGUiOiJESVNQTEFZX0NBUkRfREVUQUlMUyIsInBheWxvYWQiOiJleUoxYVdRaU9pSlZjRzFsYTFSWVkwb2lMQ0pqWVhKa1NXUWlPaUpqWVhKa0xVSkhRbkJEZUdwYVR5SXNJbkp6WVZCMVlteHBZMHRsZVNJNklreFRNSFJNVXpGRFVsVmtTbFJwUWxGV1ZVcE5VMVZOWjFNd1ZscE1VekIwVEZNd1MxUlZiRXBSTUd4eFVWVTFRMW95ZEhoaFIzUndVbnBzTTAxRlNrSlZWVlpIVVZWR1VGRXdSbTVQUlVaT1UxVnNSRkV5WkV4Uk1FWnVVbFZGTVZsdVVUTlZlbHAyVTNrNWEwNXNaRTVrVlZwMlVXczVVMDVyZEV0amJrcDVZekZ2ZUZKWGFIUlNNMVpKVFc1U1RVMXJZelJVTVdRMlZXMVpORXd4YkhSaFNGSjRXVE5PV0ZGWGVFbFZNM0JSVWtoS1ZXVkVaSGhpYTNSV1ZWZFNUMkpHVmtoT01XaEhWa1Z6ZDJGdVdtOVhibVIxWVhwV2NHTldhRFpYUlVwelUwVnNZV0ZyUmtoVWEyeE1ZMWhHVDJOSE5VdFRhM1EyVTBoWmNtVlZhRkJPUjJSR1dUTmtSVkZXUm5SYVZXUlRZbFpPYTAxV1VtdGpSMnhvUzNwc1UwNVZkRXRQUlVwelRVWmFVRlZUZEhSaU0wWkNWR3BvVVV3eFdtNVJWVVpzWVRKa01GVXpXbkZpU0d3eFZWVlNhbFJ0T1hGV1JVWmFWa1Z3TUZKcVVtdFpibEkwV1d4a1NtTklUVE5WTTBaUVkydEdUbFZHU25sVGJVNUhaVlZ6TldSNlJsTldWWGhMWlVWc1NWRnVSa1prZWtwUldWUlNWbFpzWkVabFZVVXdaR3BTYlZsdE5EUldSMnhPWTJwT2NFOVZPVTFhVlZKR1pFVlNibHBGYkU5TWVYTTFZVWhrZFZKdVp6SlhiVFZ1V201Q1JVc3pTWEpSTWpFd1YxTTVlVmt3YkdwWlZWcENXVmRPTTJWdFNrWmhSRUpFWkVWU1Ewd3hiRzlXVldneVl6TnNWV1ZZVlROVGFscFpUakI0ZW1GR1ZUVmtWbVJyVFZWS1JWZFhkM1pPVlhkNFN6TnZNbEZ1VW1GUmFtZDJZVlYwVVZReGJIQk5TRTVPVFRKMFVscEVUbGRWVjJneFVWaEdTR0ZZU25CUFZWcFdXa2RPYldWV1RrMU5NazVUVW14ak5HUnBPVTFoTUhSWlRERktWMHd5T1U1UFZ6VlNUbTF3VG1GcVdtMWtNSEJKWTIxa1IxbHVUbmxpVlRsS1VWWm9lVTVZVmpSYVYzaHJWVVY0U2xSc1FqSlNWbkJzVWtaQ2NGWkZlRFJVYm14dlpGVnJlVTR4YkUxWmJscGFUa1pzYkdKdGRHOWxhemt6V210U1UwOVRPREprUlVaclYwWktSRk5wZEhKaFZrSlVWVmhWZDJFeGFIWmlha0o1V1RGdk5WZHNhM2haTVVaYVYwUnNWVk5WWnpKTlZYaEtWVzVLVFZkRmNFaGtSMFoxVERGQ1dWWnVjRzVaTVVsMlZsaHNSMVZZUmxoaGJVcEtWbXhKZGxwR1ZsWmthVGx0VlhwU2QxZEdWWEpWUlhBelZGVk9lbVJYV25OUldHeDNZbFJHY0U5RlNuZFdhelY2WldwQk1XRnRkelJTYkZZMlZERmFVVTVWUmxWbFZHUlJUbXRhVGs1c1FUQmtNVTVxVWtod2FGZHVjRU5oVm10MlUwWlZNazV0T1cxaVZscEtVVEp3TWswd1pETmtTR3Q0Vkc1WmNsWnVhRlZrVkZGM1UxVnplVnB0YnpST2VscDJUa2hrZFU1Vk5VMWhNSE4zVFVOMFJsVkZWbHBaYWtaeVdWVkdkbEpGZUd0V01qa3daRzVPYUU5Vk9WRmtTR1J3VWxWT1FtUXdWa0pSVmtVNVVGRnZkRXhUTUhSTVZWWlBVa05DVVZaVlNrMVRWVTFuVXpCV1dreFRNSFJNVXpBOUluMD0ifSwiY3VzdG9tZXIiOnsidWlkIjoiVXBtZWtUWGNKIiwiZW1haWwiOiJ6YW5jaGkxMDJAeW9wbWFpbC5jb20ifSwiZmFjdG9yIjoib3RwIiwiY2hhbm5lbCI6ImVtYWlsIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDIxLTA0LTI3VDA4OjU0OjAxLjI2NVoiLCJpYXQiOjE2MTk1MTMzNDEsImV4cCI6MTYxOTUxMzY0MSwiYXVkIjoib2RiX2F1dGhlbnRpY2F0aW9uX2RldiIsImlzcyI6Im9kYl9hdXRoZW50aWNhdGlvbiJ9.Ak3DKANmRRnTrC_nPccsxZMbI2OGKXh1FI4TcWDJS5M',
        )
        .send({
          rsaPublicKey,
        })
        .expect(200)
        .expect(response => {
          expect(response.body).toEqual({
            encryptedData:
              'Zipq08J87p528LGYHtytibeP628R4DpPYlLwI4w/7G7khjIhJC7KQ1uWM0/8MNx4rtk0yCaDGqVIh6psbeIg/dkeUzTtSWJdWRrHJohJ19HSTHGRfr/ziKI7WIekwT6AGyqOs5lxqOWgAregdN84Ylqnlqy4So8Ysf4tdAdesB9v+t50uSTtwRfSl0g6tnlxgOSTgruac6SsqOxjjixqlRruGWV9ekCq/304SOOVouZnjkvKSvhxkGTuPbnk13sAAa/qeKyVQTWOEOBTdbcXLy1amDyBpL1Kk6WQjeIqQsmBPtB+9uaI96rzF10/q8wLpB0YZc34rNoJahlcr2an879s3jyRJp/nqdyKpxNZ6CF5/g9/ixD/zDhSyja1lR4hffLMIyoSBHCEHhMtm/xQ4DQX6DVKmWqR17wST30zTCOLn2DbmN9GaDdPPkEB6/tnX8rtGe77+Wr8cHpoiuOw06r/Jb2aS+2RmoMk8tdx7hbEutf73MeXwk3lGggXy89xOAEq6eVRzQNsp6kfpxj6VC4BDUBZQSdaeBBWx+hnGvNgzFps4uL6S+SnxV3B8wYfjMTCUvO0o1eSFcJe4oSsRArY1YM3xN0l4KvK3uDR5uFkjzXQRnACH8dJ5b0rXS7wBzb5ad32elwfNhWR0e6jggyuUZGNADZV9fLSmm2NEH8=',
            isSuccess: true,
          });
        });
    });

    it('Should not get encrypted card details for a card not owned', async () => {
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/displaydetails')
        .send({
          rsaPublicKey,
        })
        .expect(401);
    });

    it('Should fail is body is missing', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'user@email.com',
        uid: 'UpmekTXcJ',
      });

      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/displaydetails')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('Card Hmac', () => {
    it('Should get encrypted card hmac', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'user@email.com',
        uid: 'UpmekTXcJ',
      });

      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/hmac')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          rsaPublicKey,
          hmacData:
            'MzMzMDMwMzAzNzMxMzIzODM2MzkzMDMwMzAzMDMyNzkzMjQzMzU1MjQzNDE1NDc1NTU1NzQzNjQzNzMxNkY1QTRGNzA3MzZENDEzMTM2MzEzOTMwMzIzMTM3MzkzNg==',
        })
        .expect(200)
        .expect(response => {
          expect(response.body).toEqual({
            encryptedData:
              'LdeMdlL6JhPjvmTmc/SkRFzXIOQdpNZRB2bMkkTNvKE91hiNTFX1rADCbjwRoWuqEjV4mza3SGANxN++6oBjqKRTONRi2huSkeweyjU2ye534ch8MWtK5WFErdqWMw8qTaIfX4rWXHliM709xmWmh/v6i/QXWr2sX6skvSC2EKFGW1+OYshQ8IjPanrsvmgNtOzYe5PiRXA7droCd8T+sPrDB1ddy4XSzLC/JzPInTzeInVbKAn+AhxcWjnygEZqWcoJmoDUNU+PjVMkBVNGePGKPfLaKxaSeQUiDkx3/s9sqkSyqP+Fij2Q8pxPcz0CXF0rnVxjcPrEbhbruvrJ3kVbIutBUx+KMBiWWVpz1NPDPTmZbjLubd/u4vsj115PMCKdCs8lFX4zV/JgQ0HX/7NpeJawA5VLr/tPwn7AvYgnWt2oR3h3u4tJ82yDA/oSTI3uOzKnI32ASD8/xQmtfuzuh9yjEUCXnKDMmZ6iW4r60bkPu0Vl7aalPjgdzCe2U3GWTmxYHUsPrcisSGo3AjyL7u8DEpd8J/W28fhgB3T1G6QUTSnZtb0L9D8yjKE7QHIV0+G6jiezWs9HeBjjKDtiZUMB7qFPxnAPlCFXAxElZD2/yB+BlQMQ3Q2GWyY/iL1R8pto3Wce7mh/xjsN3l7kqSCHxjX6j7lG0xFfpZg=',
            isSuccess: true,
          });
        });
    });

    it('Should not get encrypted card hmac for a card not owned', async () => {
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/hmac')
        .send({
          rsaPublicKey,
          hmacData:
            'MzMzMDMwMzAzNzMxMzIzODM2MzkzMDMwMzAzMDMyNzkzMjQzMzU1MjQzNDE1NDc1NTU1NzQzNjQzNzMxNkY1QTRGNzA3MzZENDEzMTM2MzEzOTMwMzIzMTM3MzkzNg==',
        })
        .expect(401);
    });

    it('Should fail is body is missing', async () => {
      const userToken = await encodeIdentity.execute({
        provider: IdentityProvider.odb,
        email: 'user@email.com',
        uid: 'UpmekTXcJ',
      });

      // WHEN
      await request(app)
        .post('/payment/accounts/UpmekTXcJ/card/card-BGBpCxjZO/hmac')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });
  });
});
