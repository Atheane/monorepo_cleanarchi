import 'reflect-metadata';
import {
  buildProfileAdapterLib,
  OneyTrustKycDocumentGateway,
  ProfileGenerator,
  ShortIdGenerator,
} from '@oney/profile-adapters';
import { KycDecisionType, UploadTaxNotice } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import MockDate from 'mockdate';
import { jest } from '@jest/globals';
import { CoreTypes, QueryService } from '@oney/common-core';
import { ServiceBusClient } from '@azure/service-bus';
import * as path from 'path';
import * as queryString from 'querystring';
import { config, identityConfig } from './fixtures/config';
import {
  kycDocumentAddedEvent,
  kycDocumentDeletedEvent,
  newFolderKycDocumentAddedEvent,
  newFolderOdbDocumentAddedEvent,
  newKycFolderCreatedEvent,
  odbDocumentAddedEvent,
  taxNoticeUploadedEvent,
  taxNoticeUploadedSecondEvent,
} from './fixtures/uploadTaxNotice/events';
import { MongodbProfile } from '../adapters/models/MongodbProfile';
import { OneyTrustFolderGateway } from '../adapters/gateways/OneyTrustFolderGateway';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/uploadTaxNotice`);
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

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
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
              name: `MnDqtMQrm/kyc/tax_notice_1607558400000.jpg`,
            }),
          }),
        }),
      }),
    },
  };
});

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

describe('Test suite for tax notice upload', () => {
  let mockBusSend: jest.Mock;
  let uploadTaxNotice: UploadTaxNotice;
  let queryService: QueryService;
  let profileGenerator: ProfileGenerator;

  const userId = 'MnDqtMQrm';
  const caseReference = 'SP_2021219_MnDqtMQrm_MAfuN2jT8';
  const oneyTrustFolderSpy = jest.spyOn(OneyTrustFolderGateway.prototype, 'askForDecision');
  const oneyTrustDeleteSpy = jest.spyOn(OneyTrustKycDocumentGateway.prototype, 'deleteDocument');

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    uploadTaxNotice = container.get(UploadTaxNotice);
    queryService = container.get(CoreTypes.queryService);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
  });

  beforeEach(() => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    mockBusSend.mockClear();
    oneyTrustFolderSpy.mockClear();
    oneyTrustDeleteSpy.mockClear();
    nock.cleanAll();
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('Should send tax notice with success', async () => {
    const { nockDone } = await nockBack(
      'Test_suite_for_tax_notice_upload_Should_send_tax_notice_with_success.json',
      {
        before,
      },
    );
    await profileGenerator.beforeIdentityDocumentStepSnapshot(userId, caseReference);
    await uploadTaxNotice.execute({
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'originalname', mimetype: 'image/jpg' },
    });
    const profileInDb = await queryService.findOne<MongodbProfile>({ uid: userId });
    expect(profileInDb.documents).toEqual([
      {
        uid: 'unique-id',
        type: 'tax_notice',
        partner: 'ODB',
        location: `${userId}/kyc/tax_notice_1613606400000.jpg`,
      },
      {
        uid: '59227',
        type: 'tax_notice',
        partner: 'KYC',
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
      },
    ]);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, odbDocumentAddedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, kycDocumentAddedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(3, taxNoticeUploadedEvent);
    expect(oneyTrustFolderSpy).toHaveBeenCalledWith(caseReference);
    nockDone();
  });

  it('Should delete file before sending new one', async () => {
    const { nockDone } = await nockBack(
      'Test_suite_for_tax_notice_upload_Should_delete_file_before_sending_new_one.json',
      {
        before,
      },
    );
    await profileGenerator.withIdentityDocumentStepSnapshot(userId, caseReference);
    await uploadTaxNotice.execute({
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'originalname', mimetype: 'image/jpg' },
    });
    const profileInDb = await queryService.findOne<MongodbProfile>({ uid: userId });
    expect(profileInDb.documents).toEqual([
      {
        uid: 'unique-id',
        type: 'id',
        side: 'front',
        location: 'MnDqtMQrm/kyc/id-front_1607558400000.jpg',
        partner: 'ODB',
      },
      {
        uid: '58428',
        type: 'id',
        side: 'front',
        location:
          'https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/SP_2021219_MnDqtMQrm_MAfuN2jT8/files',
        partner: 'KYC',
      },
      {
        uid: 'unique-id',
        type: 'tax_notice',
        partner: 'ODB',
        location: 'MnDqtMQrm/kyc/tax_notice_1614729600000.jpg',
      },
      {
        uid: 'unique-id',
        type: 'tax_notice',
        partner: 'ODB',
        location: 'MnDqtMQrm/kyc/tax_notice_1613606400000.jpg',
      },
      {
        uid: '59227',
        type: 'tax_notice',
        partner: 'KYC',
        location:
          'https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/SP_2021219_MnDqtMQrm_MAfuN2jT8/files',
      },
    ]);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, kycDocumentDeletedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, odbDocumentAddedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(3, kycDocumentAddedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(4, taxNoticeUploadedEvent);
    expect(oneyTrustFolderSpy).toHaveBeenCalledWith(caseReference);
    nockDone();
  });

  it('Should create new OT Folder', async () => {
    MockDate.set(new Date('2021-03-06T00:00:00.000Z'));
    const date = new Date();
    const newCaseReference = `SP_${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}_${userId}_unique-id`;
    const { nockDone } = await nockBack('Test_suite_for_tax_notice_upload_Should_create_new_OT_Folder.json', {
      before,
    });
    const profile = await profileGenerator.beforeTaxNoticeSnapshot(userId, caseReference);
    expect(profile.props.kyc.versions).toBeUndefined();
    await uploadTaxNotice.execute({
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'originalname', mimetype: 'image/jpg' },
    });
    const profileInDb = await queryService.findOne<MongodbProfile>({ uid: userId });
    expect(profileInDb.kyc.versions[0].case_reference).toBeDefined();
    expect(profileInDb.documents).toEqual([
      {
        uid: 'unique-id',
        type: 'tax_notice',
        partner: 'ODB',
        location: `${userId}/kyc/tax_notice_1614988800000.jpg`,
      },
      {
        uid: '59227',
        type: 'tax_notice',
        partner: 'KYC',
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${newCaseReference}/files`,
      },
    ]);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, newKycFolderCreatedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, newFolderOdbDocumentAddedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(3, newFolderKycDocumentAddedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(4, taxNoticeUploadedSecondEvent);
    expect(oneyTrustFolderSpy).toHaveBeenCalledWith(newCaseReference);
    nockDone();
  });

  it('Should not delete file if new KYC created', async () => {
    MockDate.set(new Date('2021-03-06T00:00:00.000Z'));
    const date = new Date();
    const newCaseReference = `SP_${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}_${userId}_unique-id`;
    const { nockDone } = await nockBack('Test_suite_for_tax_notice_upload_Should_create_new_OT_Folder.json', {
      before,
    });
    const profile = await profileGenerator.withTaxNoticeDocumentSnapshot(userId, caseReference);
    expect(profile.props.kyc.versions).toBeUndefined();
    expect(profile.props.kyc.decision).toEqual(KycDecisionType.OK_MANUAL);
    await uploadTaxNotice.execute({
      uid: userId,
      file: { buffer: Buffer.from(''), originalname: 'originalname', mimetype: 'image/jpg' },
    });
    const profileInDb = await queryService.findOne<MongodbProfile>({ uid: userId });
    expect(profileInDb.kyc.versions[0].case_reference).toBeDefined();
    expect(profileInDb.documents).toEqual([
      {
        uid: 'unique-id',
        type: 'id',
        side: 'front',
        location: 'MnDqtMQrm/kyc/id-front_1607558400000.jpg',
        partner: 'ODB',
      },
      {
        uid: '58428',
        type: 'id',
        side: 'front',
        location:
          'https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/SP_2021219_MnDqtMQrm_MAfuN2jT8/files',
        partner: 'KYC',
      },
      {
        uid: 'unique-id',
        type: 'tax_notice',
        partner: 'ODB',
        location: 'MnDqtMQrm/kyc/tax_notice_1614729600000.jpg',
      },
      {
        uid: '59227',
        type: 'tax_notice',
        partner: 'KYC',
        location:
          'https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/SP_2021219_MnDqtMQrm_MAfuN2jT8/files',
      },
      {
        uid: 'unique-id',
        type: 'tax_notice',
        partner: 'ODB',
        location: `${userId}/kyc/tax_notice_1614988800000.jpg`,
      },
      {
        uid: '59227',
        type: 'tax_notice',
        partner: 'KYC',
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${newCaseReference}/files`,
      },
    ]);
    expect(oneyTrustDeleteSpy).not.toHaveBeenCalled();
    expect(oneyTrustFolderSpy).toHaveBeenCalledWith(newCaseReference);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, newKycFolderCreatedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, newFolderOdbDocumentAddedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(3, newFolderKycDocumentAddedEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(4, taxNoticeUploadedSecondEvent);
    nockDone();
  });
});
