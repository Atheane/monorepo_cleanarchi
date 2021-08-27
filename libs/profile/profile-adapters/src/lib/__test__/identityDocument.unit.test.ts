import 'reflect-metadata';
import { buildProfileAdapterLib, ProfileGenerator, ShortIdGenerator } from '@oney/profile-adapters';
import {
  DocumentSide,
  DocumentType,
  ProfileDocumentPartner,
  Steps,
  UploadIdentityDocument,
} from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { CoreTypes, QueryService } from '@oney/common-core';
import MockDate from 'mockdate';
import { jest } from '@jest/globals';
import { CountryCode, ProfileStatus } from '@oney/profile-messages';
import * as queryString from 'querystring';
import * as path from 'path';
import { config, identityConfig } from './fixtures/config';
import { OneyTrustFolderGateway } from '../adapters/gateways/OneyTrustFolderGateway';
import { MongodbProfile } from '../adapters/models/MongodbProfile';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/identityDocument`);
nockBack.setMode('record');

jest.spyOn(ShortIdGenerator.prototype, 'generateUniqueID').mockImplementation(() => 'unique-id');
MockDate.set(new Date('2020-12-10T00:00:00.000Z'));

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
              name: `MnDqtMQrm/kyc/id-front_1607558400000.jpg`,
            }),
          }),
        }),
      }),
    },
  };
});

jest.mock('jsonwebtoken', () => ({
  sign: jest
    .fn()
    .mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE1MTIwNDgzLWE4ZjgtNDViMS05N2JiLWU0ZGQ4NzZiNTlhMCJ9.eyJmbG93c3RlcHMiOlsiU0NBX0lOQVBQIl0sImNsaWVudF9pZCI6IlBUQUlMX0JRX0RJR0lUIiwiaWRlbnRpZmllcnMiOlt7ImlkIjoiTkdGT0hGeDhVc3JybldtbllDZWJRYjdxcXNFQjNaVWdfNkNMUzNFTVZIUGFNUDFhIiwidHlwZSI6IkZQIn1dLCJpYXQiOjE2MTEyNTA2MjgsImV4cCI6MTYxMzg0MjYyOCwiaXNzIjoiT0RCIiwic3ViIjoiaW5vaWQxMDAzODc1NzE2In0.b1sQOFeaMER3z8Xc-rmRWLzNdQboaZzHFoGdNGh55lCd3vaNdYDqpeiOoD3lSaZmOfbw1N8URxqB1by7cPVJhGmTO38vtn-UiYL5pu3Qoj1862dq5krM2es8X7FzUdW9Jn7kxTbmYCA8vb0pX5oVHgipDD_uHTzqAOBPYw6QygU',
    ),
}));

const container = new Container();

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

describe('Test suite for profile adapters', () => {
  let identityDocument: UploadIdentityDocument;
  let queryService: QueryService;
  let profileGenerator: ProfileGenerator;

  const userId = 'MnDqtMQrm';
  const caseReference = 'SP_2021219_MnDqtMQrm_MAfuN2jT8';

  const oneyTrustFolderSpy = jest.spyOn(OneyTrustFolderGateway.prototype, 'askForDecision');

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    identityDocument = container.get(UploadIdentityDocument);
    queryService = container.get(CoreTypes.queryService);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
  });

  it('Should complete identityDocument step', async () => {
    const { nockDone } = await nockBack('identity-document-step-validation.json', { before });
    await profileGenerator.beforeIdentityDocumentStepSnapshot(userId, caseReference);
    const result = await identityDocument.execute({
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'originalname', mimetype: 'image/jpg' },
      documentType: DocumentType.ID_DOCUMENT,
      documentSide: DocumentSide.FRONT,
      nationality: CountryCode.FR,
    });

    const profileInDb = await queryService.findOne<MongodbProfile>({ uid: userId });
    expect(result.props.kyc.steps).not.toContain(Steps.IDENTITY_DOCUMENT_STEP);
    expect(result.props.informations.nationalityCountryCode).toEqual(CountryCode.FR);
    expect(profileInDb.documents).toEqual([
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
    nockDone();
  });

  it('Should revalidate identityDocument step when id document is uploaded a second time', async () => {
    const { nockDone } = await nockBack('identity-document-step-re-validation.json', { before });
    await profileGenerator.beforeIdentityDocumentStepSnapshot(userId, caseReference);
    const cmd = {
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'originalname', mimetype: 'image/jpg' },
      documentType: DocumentType.ID_DOCUMENT,
      documentSide: DocumentSide.FRONT,
      nationality: CountryCode.FR,
    };

    await identityDocument.execute(cmd);
    const result = await identityDocument.execute(cmd);

    const profileInDb = await queryService.findOne<MongodbProfile>({ uid: userId });
    expect(result.props.kyc.steps).not.toContain(Steps.IDENTITY_DOCUMENT_STEP);
    expect(result.props.informations.nationalityCountryCode).toEqual(CountryCode.FR);
    expect(profileInDb.documents).toEqual([
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
    nockDone();
  });

  it('should upload back side of id when id is uploaded with a different document side', async () => {
    const { nockDone } = await nockBack('identity-document-back-validation.json', { before });
    await profileGenerator.withIdentityDocumentStepSnapshot(userId, caseReference);

    const cmd = {
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'id-back', mimetype: 'image/jpg' },
      documentType: DocumentType.ID_DOCUMENT,
      documentSide: DocumentSide.BACK,
      nationality: CountryCode.FR,
    };

    const result = await identityDocument.execute(cmd);

    const profileInDb = await queryService.findOne<MongodbProfile>({ uid: userId });
    expect(result.props.kyc.steps).not.toContain(Steps.IDENTITY_DOCUMENT_STEP);
    expect(result.props.informations.nationalityCountryCode).toEqual(CountryCode.FR);
    expect(
      profileInDb.documents.filter(
        document =>
          document.partner === ProfileDocumentPartner.ODB && document.type !== DocumentType.TAX_NOTICE,
      ),
    ).toEqual([
      {
        uid: 'unique-id',
        type: 'id',
        side: 'front',
        partner: 'ODB',
        location: `${userId}/kyc/id-front_1607558400000.jpg`,
      },
      {
        uid: 'unique-id',
        type: 'id',
        side: 'back',
        partner: 'ODB',
        location: `${userId}/kyc/id-back_1607558400000.jpg`,
      },
    ]);
    nockDone();
  });

  it('should upload back side of id to oney trust when id is uploaded with a different document side', async () => {
    const { nockDone } = await nockBack('identity-document-back-validation.json', { before });
    await profileGenerator.withIdentityDocumentStepSnapshot(userId, caseReference);

    const cmd = {
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'id-back', mimetype: 'image/jpg' },
      documentType: DocumentType.ID_DOCUMENT,
      documentSide: DocumentSide.BACK,
      nationality: CountryCode.FR,
    };

    const result = await identityDocument.execute(cmd);

    const profileInDb = await queryService.findOne<MongodbProfile>({ uid: userId });
    expect(result.props.kyc.steps).not.toContain(Steps.IDENTITY_DOCUMENT_STEP);
    expect(result.props.informations.nationalityCountryCode).toEqual(CountryCode.FR);
    expect(
      profileInDb.documents.filter(
        document =>
          document.partner === ProfileDocumentPartner.KYC && document.type !== DocumentType.TAX_NOTICE,
      ),
    ).toEqual([
      {
        uid: '58428',
        type: 'id',
        side: 'front',
        partner: 'KYC',
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
      },
      {
        uid: '59227',
        type: 'id',
        side: 'back',
        partner: 'KYC',
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
      },
    ]);
    nockDone();
  });

  it('should should ask for kyc decision when profile status is action required id', async () => {
    const { nockDone } = await nockBack('identity-document-back-validation.json', { before });
    await profileGenerator.withIdentityDocumentStepSnapshot(
      userId,
      caseReference,
      ProfileStatus.ACTION_REQUIRED_ID,
    );

    const cmd = {
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'id-back', mimetype: 'image/jpg' },
      documentType: DocumentType.ID_DOCUMENT,
      documentSide: DocumentSide.BACK,
      nationality: CountryCode.FR,
    };

    await identityDocument.execute(cmd);

    expect(oneyTrustFolderSpy).toHaveBeenCalledWith(caseReference);

    nockDone();
  });

  it('Should complete identityDocument step with passport', async () => {
    const { nockDone } = await nockBack('identity-document-step-validation.json', { before });
    await profileGenerator.beforeIdentityDocumentStepSnapshot(userId, caseReference);
    const result = await identityDocument.execute({
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'originalname', mimetype: 'image/jpg' },
      documentType: DocumentType.PASSPORT,
      nationality: CountryCode.GB,
    });
    expect(result.props.kyc.steps).not.toContain(Steps.IDENTITY_DOCUMENT_STEP);
    expect(result.props.informations.nationalityCountryCode).toEqual(CountryCode.GB);
    nockDone();
  });

  it('Should complete identityDocument step without mimetype', async () => {
    const { nockDone } = await nockBack('identity-document-step-validation.json', { before });
    await profileGenerator.beforeIdentityDocumentStepSnapshot(userId, caseReference);
    const result = await identityDocument.execute({
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'originalname' },
      documentType: DocumentType.ID_DOCUMENT,
      documentSide: DocumentSide.FRONT,
      nationality: CountryCode.FR,
    });
    expect(result.props.kyc.steps).not.toContain(Steps.IDENTITY_DOCUMENT_STEP);
    expect(result.props.informations.nationalityCountryCode).toEqual(CountryCode.FR);
    nockDone();
  });
});
