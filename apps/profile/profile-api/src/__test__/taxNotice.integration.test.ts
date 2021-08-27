import { ProfileGenerator, ShortIdGenerator } from '@oney/profile-adapters';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import * as nock from 'nock';
import { Profile } from '@oney/profile-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { CoreTypes } from '@oney/common-core';
import MockDate from 'mockdate';
import * as path from 'path';
import * as fs from 'fs';
import * as queryString from 'querystring';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/uploadTaxNotice`);
nockBack.setMode('record');

jest.spyOn(ShortIdGenerator.prototype, 'generateUniqueID').mockImplementation(() => 'unique-id');
MockDate.set(new Date('2020-12-10T00:00:00.000Z'));

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

//TODO use jest manual mocks instead of duplicating same mocking code
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue({
        getContainerClient: jest.fn().mockReturnValue({
          getBlobClient: jest.fn().mockReturnValue({
            getBlockBlobClient: jest.fn().mockReturnValue({
              uploadStream: jest.fn().mockReturnValue({
                requestId: jest.fn(),
              }),
              upload: jest.fn(),
              name: `MnDqtMQrm/kyc/tax_notice_1607558400000.jpg`,
            }),
          }),
        }),
      }),
    },
  };
});

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

describe('tax notice sending api testing', () => {
  let container: Container;
  const userId = 'beGe_flCm';
  const caseReference = 'SP_2021212_beGe_flCm_frDNGY01Y';
  let user: Profile;
  let profileDb;
  let identityEncode;
  let writeService;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
    profileDb = container.get(ProfileGenerator);
    identityEncode = container.get(EncodeIdentity);
    writeService = container.get(CoreTypes.writeService);
    nock.cleanAll();
    nock.enableNetConnect();
  });

  beforeEach(async () => {
    writeService.clear();
    user = await profileDb.beforeIdentityDocumentStepSnapshot(userId, caseReference);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should send Tax Notice', async () => {
    const { nockDone } = await nockBack('Test_suite_for_tax_notice_upload_Should_send_tax_notice.json', {
      before,
    });
    nock.enableNetConnect(/127\.0\.0\.1/);

    const userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    const file = await fs.readFileSync(__dirname + '/env/laf2.jpg');
    await request(app)
      .post(`/profile/user/${userId}/tax-notice`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', file, { filename: 'laf2', contentType: 'image/jpg' })
      .expect(200)
      .expect(response => {
        expect(response.body.documents.length).toEqual(2);
        expect(response.body.documents).toEqual([
          {
            uid: 'unique-id',
            type: 'tax_notice',
            partner: 'ODB',
            location: `${userId}/kyc/tax_notice_1607558400000.jpg`,
          },
          {
            uid: '59227',
            type: 'tax_notice',
            partner: 'KYC',
            location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
          },
        ]);
      });

    nockDone();
  });

  it('Should reject request when file not in request', async () => {
    const userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post(`/profile/user/${userId}/tax-notice`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
  });

  it('Should reject request when token not authorized', async () => {
    const file = await fs.readFileSync(__dirname + '/env/laf2.jpg');
    const userToken = await identityEncode.execute({
      uid: 'toto',
      email: 'toto@toto.fr',
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post(`/profile/user/${userId}/tax-notice`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', file, { filename: 'laf2', contentType: 'image/jpg' })
      .expect(401);
  });
});
