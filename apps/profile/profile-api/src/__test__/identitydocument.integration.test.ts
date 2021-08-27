import { ProfileGenerator, ShortIdGenerator } from '@oney/profile-adapters';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import * as nock from 'nock';
import { Identifiers, Profile, ProfileRepositoryRead, Steps } from '@oney/profile-core';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { CoreTypes } from '@oney/common-core';
import MockDate from 'mockdate';
import * as path from 'path';
import * as fs from 'fs';
import * as queryString from 'querystring';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/identityDocument`);
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
              name: `beGe_flCm/kyc/id-front_1607558400000.jpg`,
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

describe('identity document step validation api testing', () => {
  let container: Container;
  const userId = 'beGe_flCm';
  const caseReference = 'SP_2021212_beGe_flCm_frDNGY01Y';
  let user: Profile;
  let profileDb;
  let identityEncode;
  let writeService;
  let profileReadService: ProfileRepositoryRead;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
    profileDb = container.get(ProfileGenerator);
    identityEncode = container.get(EncodeIdentity);
    writeService = container.get(CoreTypes.writeService);
    profileReadService = container.get(Identifiers.profileRepositoryRead);
    nock.cleanAll();
    nock.enableNetConnect();
  });

  beforeEach(async () => {
    writeService.clear();
    user = await profileDb.beforeIdentityDocumentStepSnapshot(userId, caseReference);
  });

  it('Should validate identity document step', async () => {
    const { nockDone } = await nockBack('identity-document-step-validation.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);
    const userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    const file = await fs.readFileSync(__dirname + '/env/laf2.jpg');
    await request(app)
      .post(`/profile/${userId}/onboarding/step/identity-document`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', file, { filename: 'laf2', contentType: 'image/jpg' })
      .field({
        documentType: 'id',
        documentSide: 'front',
        nationality: 'FR',
      })
      .expect(200)
      .expect(response => {
        expect(response.body.steps.includes(Steps.IDENTITY_DOCUMENT_STEP)).toBeFalsy();
        expect(response.body.documents.length).toEqual(2);
        expect(response.body.documents).toEqual([
          {
            uid: 'unique-id',
            type: 'id',
            side: 'front',
            partner: 'ODB',
            location: `${userId}/kyc/id-front_1607558400000.jpg`,
          },
          {
            uid: '58232',
            type: 'id',
            side: 'front',
            partner: 'KYC',
            location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
          },
        ]);
      });

    const updatedProfile = await profileReadService.getUserById(userId);
    expect(updatedProfile.props.informations.nationalityCountryCode).toEqual('FR');

    await nockDone();
  });
  it('Should revalidate identityDocument step when id document is uploaded a second time', async () => {
    const { nockDone } = await nockBack('identity-document-step-re-validation.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);

    const userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    const file = await fs.readFileSync(__dirname + '/env/laf2.jpg');

    await request(app)
      .post(`/profile/${userId}/onboarding/step/identity-document`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', file, { filename: 'laf2', contentType: 'image/jpg' })
      .field({
        documentType: 'id',
        documentSide: 'front',
        nationality: 'FR',
      });

    await request(app)
      .post(`/profile/${userId}/onboarding/step/identity-document`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', file, { filename: 'laf2', contentType: 'image/jpg' })
      .field({
        documentType: 'id',
        documentSide: 'front',
        nationality: 'FR',
      })
      .expect(200)
      .expect(response => {
        expect(response.body.steps.includes(Steps.IDENTITY_DOCUMENT_STEP)).toBeFalsy();
        expect(response.body.documents.length).toEqual(2);
        expect(response.body.documents).toEqual([
          {
            uid: 'unique-id',
            type: 'id',
            side: 'front',
            partner: 'ODB',
            location: `${userId}/kyc/id-front_1607558400000.jpg`,
          },
          {
            uid: '58698',
            type: 'id',
            side: 'front',
            partner: 'KYC',
            location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
          },
        ]);
      });

    const updatedProfile = await profileReadService.getUserById(userId);
    expect(updatedProfile.props.informations.nationalityCountryCode).toEqual('FR');

    await nockDone();
  });

  it('Should validate identity document step with passport', async () => {
    const { nockDone } = await nockBack('identity-document-step-validation.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);

    const userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    const file = await fs.readFileSync(__dirname + '/env/laf2.jpg');
    await request(app)
      .post(`/profile/${userId}/onboarding/step/identity-document`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', file, { filename: 'laf2', contentType: 'image/jpg' })
      .field({
        documentType: 'passport',
        nationality: 'ES',
      })
      .expect(200)
      .expect(response => {
        expect(response.body.steps.includes(Steps.IDENTITY_DOCUMENT_STEP)).toBeFalsy();
      });

    const updatedProfile = await profileReadService.getUserById(userId);
    expect(updatedProfile.props.informations.nationalityCountryCode).toEqual('ES');

    await nockDone();
  });

  it('Should validate identity document step with pdf document', async () => {
    const { nockDone } = await nockBack('identity-document-pdf-step-validation.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);

    const userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    const file = await fs.readFileSync(__dirname + '/env/passport-example.pdf');
    await request(app)
      .post(`/profile/${userId}/onboarding/step/identity-document`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', file, { filename: 'passport-example', contentType: 'application/pdf' })
      .field({
        documentType: 'passport',
        nationality: 'ES',
      })
      .expect(200)
      .expect(response => {
        expect(response.body.steps.includes(Steps.IDENTITY_DOCUMENT_STEP)).toBeFalsy();
      });

    const updatedProfile = await profileReadService.getUserById(userId);
    expect(updatedProfile.props.documents.length).toEqual(2);
    expect(updatedProfile.props.documents.map(doc => doc.props)).toEqual([
      {
        uid: 'unique-id',
        type: 'passport',
        side: undefined,
        partner: 'ODB',
        location: `${userId}/kyc/passport_1607558400000.pdf`,
      },
      {
        uid: '63230',
        type: 'passport',
        side: undefined,
        partner: 'KYC',
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
      },
    ]);
    expect(updatedProfile.props.informations.nationalityCountryCode).toEqual('ES');

    await nockDone();
  });

  it('Should not validate identity document step when user is not authorized', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const userToken = await identityEncode.execute({
      uid: 'wrong-id',
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post(`/profile/${userId}/onboarding/step/identity-document`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', Buffer.from(''), { filename: 'laf2', contentType: 'image/jpg' })
      .field({
        documentType: 'id',
        documentSide: 'front',
        nationality: 'FR',
      })
      .expect(401);
  });

  it('Should reject request when command is wrong', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post(`/profile/${userId}/onboarding/step/identity-document`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('document', Buffer.from(''), { filename: 'laf2', contentType: 'image/jpg' })
      .field({})
      .expect(400);
  });
});
