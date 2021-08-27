/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { EventDispatcher } from '@oney/messages-core';
import * as nock from 'nock';
import {
  BankAccount,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  DiligenceStatus,
  DiligencesType,
  NetworkError,
  NotifyDiligenceByAggregationToPartner,
  PaymentIdentifier,
  SendKycDocument,
  SendKycDocumentRequest,
} from '@oney/payment-core';
import {
  DocumentSide,
  DocumentType,
  KycDecisionType,
  ProfileActivated,
  ProfileActivationType,
  UserKycDecisionUpdated,
} from '@oney/profile-messages';
import { defaultLogger } from '@oney/logger-adapters';
import * as path from 'path';
import * as queryString from 'querystring';
import { naruto } from './fixtures/config/naruto';
import { initializePaymentKernel } from './fixtures/initializePaymentKernel';
import { errorSMoney400, errorSMoney500 } from './fixtures/smoneyKyc/expectedErrors';
import { profileProps } from './fixtures/smoneyKyc/profile';
import { PaymentKernel } from '../di/PaymentKernel';
import { SmoneyKycGateway } from '../adapters/gateways/SmoneyKycGateway';
import { ProfileActivatedHandler } from '../adapters/handlers/profile/ProfileActivatedHandler';
import { UserKycDecisionUpdatedEventHandler } from '../adapters/handlers/profile/UserKycDecisionUpdatedEventHandler';
import { SmoneyKycFiltersMapper } from '../adapters/mappers/SmoneyKycFiltersMapper';

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
    }),
  },
}));

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        listBlobsFlat: jest.fn().mockReturnValue([
          {
            name: 'kyc/id-back.jpg',
          },
          {
            name: 'kyc/id-front.jpg',
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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyKyc`);
nockBack.setMode('record');

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

describe('Test suite for kyc', () => {
  let kernel: PaymentKernel;
  let sendKycDocument: SendKycDocument;
  let bankAccountRepositoryWriter: BankAccountRepositoryWrite;
  let bankAccountRepositoryReader: BankAccountRepositoryRead;

  const sendDocumentSpy = jest.spyOn(SendKycDocument.prototype, 'execute');
  const setFiltersSpy = jest.spyOn(SmoneyKycGateway.prototype, 'setFilters');
  const createDocumentSpy = jest.spyOn(SmoneyKycGateway.prototype, 'createDocument');
  const notifyAggregUsecaseSpy = jest.spyOn(NotifyDiligenceByAggregationToPartner.prototype, 'execute');

  const kycDocuments = [
    {
      location: 'VwhMDUBkG/kyc/id-back_1607558400000.jpg',
      side: DocumentSide.BACK,
      type: DocumentType.ID_DOCUMENT,
    },
    {
      location: 'VwhMDUBkG/kyc/id-front_1607558400000.jpg',
      side: DocumentSide.FRONT,
      type: DocumentType.ID_DOCUMENT,
    },
  ];

  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessToken.json', { before });

    kernel = await initializePaymentKernel({ useAzure: true });

    sendKycDocument = kernel.get(SendKycDocument);
    bankAccountRepositoryWriter = kernel.get(PaymentIdentifier.bankAccountRepositoryWrite);
    bankAccountRepositoryReader = kernel.get(PaymentIdentifier.bankAccountRepositoryRead);

    await nockDone();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should return a correct SMONEY ppe sanctions request with all true value', async () => {
    const smoneyKycMappers = new SmoneyKycFiltersMapper().fromDomain({
      uid: 'test',
      kycValues: {
        decision: KycDecisionType.OK_MANUAL,
        politicallyExposed: KycDecisionType.KO_MANUAL,
        sanctioned: KycDecisionType.OK_MANUAL,
      },
    });
    expect(smoneyKycMappers).toEqual({
      uid: 'test',
      PPE: true,
      Sanction: true,
      FCC: null,
    });
  });

  it('Should return a correct SMONEY ppe sanctions request with only one true value', async () => {
    const smoneyKycMappers = new SmoneyKycFiltersMapper().fromDomain({
      uid: 'test',
      kycValues: {
        decision: KycDecisionType.OK_MANUAL,
        politicallyExposed: KycDecisionType.OK,
        sanctioned: KycDecisionType.OK_MANUAL,
      },
    });
    expect(smoneyKycMappers).toEqual({
      uid: 'test',
      PPE: false,
      Sanction: true,
      FCC: null,
    });
  });

  it('Should return a correct SMONEY ppe sanctions request', async () => {
    const smoneyKycMappers = new SmoneyKycFiltersMapper().fromDomain({
      uid: 'test',
      kycValues: {
        decision: KycDecisionType.OK_MANUAL,
        politicallyExposed: KycDecisionType.OK,
        sanctioned: KycDecisionType.OK,
      },
    });
    expect(smoneyKycMappers).toEqual({
      uid: 'test',
      PPE: false,
      Sanction: false,
      FCC: null,
    });
  });

  it('Should return status validated', async () => {
    // GIVEN
    const request: SendKycDocumentRequest = {
      uid: 'VwhMDUBkG',
      documents: kycDocuments,
    };

    // WHEN
    const scope = nock('https://sb-api.xpollens.com')
      .post('/api/V1.1/users/VwhMDUBkG/kyc/attachments')
      .reply(200, {
        type: 'ID_CARD',
        status: 'Validated',
        files: [
          {
            name: 'CIN.JPEG',
            key: '80074298-acc9-40bc-9dc8-96a1d32106f8',
          },
        ],
      });
    const result = await sendKycDocument.execute(request);

    // THEN
    expect(result.status).toEqual('Validated');
    scope.done();
  });

  it('Should return S-Money API error with 400', async () => {
    // GIVEN
    const error = new NetworkError.ApiResponseError('SMONEY_API_ERROR', errorSMoney400);
    const request: SendKycDocumentRequest = {
      uid: 'userTest',
      documents: kycDocuments,
    };

    // WHEN
    const scope = nock('https://sb-api.xpollens.com')
      .post('/api/V1.1/users/userTest/kyc/attachments')
      .reply(400);
    const result = sendKycDocument.execute(request);

    // THEN
    await expect(result).rejects.toEqual(error);
    scope.done();
  });

  it('Should return S-Money API error with 500', async () => {
    // GIVEN
    const error = new NetworkError.ApiResponseError('SMONEY_API_ERROR', errorSMoney500);
    const request: SendKycDocumentRequest = {
      uid: 'xwAXKChwm',
      documents: kycDocuments,
    };

    // WHEN
    const scope = nock('https://sb-api.xpollens.com')
      .post('/api/V1.1/users/xwAXKChwm/kyc/attachments')
      .reply(500);
    const result = sendKycDocument.execute(request);

    // THEN
    await expect(result).rejects.toEqual(error);
    scope.done();
  });

  it('Should resolves with no error after domain event', async () => {
    // GIVEN
    const userKycUpdatedEvent: UserKycDecisionUpdated = {
      id: 'poakzeo',
      props: profileProps,
      metadata: {
        aggregate: UserKycDecisionUpdated.name,
        aggregateId: 'xwAXKChwm',
      },
    };
    const scope = nock('https://sb-api.xpollens.com');

    // WHEN
    scope.post('/api/V1.1/users/xwAXKChwm/kyc/attachments').reply(200, {
      type: 'ID_CARD',
      status: 'Validated',
      files: [
        {
          name: 'CIN.JPEG',
          key: '80074298-acc9-40bc-9dc8-96a1d32106f8',
        },
      ],
    });
    scope.patch('/api/V1.1/user/xwAXKChwm/sanctionpperesults').reply(201);
    const eventHandler = new UserKycDecisionUpdatedEventHandler(
      kernel.get(SendKycDocument),
      kernel.get(PaymentIdentifier.kycGateway),
      defaultLogger,
    ).handle(userKycUpdatedEvent);

    // THEN
    await expect(eventHandler).resolves.toBeUndefined();
    expect(sendDocumentSpy).toHaveBeenCalledTimes(1);
    expect(setFiltersSpy).toHaveBeenCalledTimes(1);
    scope.done();
  });

  it('Should not call sendDocument nor setFilters because decision and PPE are pending', async () => {
    const userKycUpdatedEvent: UserKycDecisionUpdated = {
      id: 'aiozejzaie',
      props: {
        ...profileProps,
        kyc: {
          ...profileProps.kyc,
          decision: KycDecisionType.PENDING_REVIEW,
          politicallyExposed: KycDecisionType.PENDING_REVIEW,
          sanctioned: KycDecisionType.OK,
        },
      },
      metadata: {
        aggregate: UserKycDecisionUpdated.name,
        aggregateId: 'xwAXKChwm',
      },
    };

    const eventHandler = new UserKycDecisionUpdatedEventHandler(
      kernel.get(SendKycDocument),
      kernel.get(PaymentIdentifier.kycGateway),
      defaultLogger,
    ).handle(userKycUpdatedEvent);

    await expect(eventHandler).resolves.toBeUndefined();
    expect(sendDocumentSpy).not.toHaveBeenCalled();
    expect(setFiltersSpy).not.toHaveBeenCalled();
  });

  it('Should only call sendDocument and not setFilters', async () => {
    const userKycUpdatedEvent: UserKycDecisionUpdated = {
      id: 'opaozkeoazek',
      props: {
        ...profileProps,
        kyc: {
          ...profileProps.kyc,
          decision: KycDecisionType.OK_MANUAL,
          politicallyExposed: KycDecisionType.OK,
          sanctioned: KycDecisionType.PENDING_REVIEW,
        },
      },
      metadata: {
        aggregate: UserKycDecisionUpdated.name,
        aggregateId: 'xwAXKChwm',
      },
    };
    const scope = nock('https://sb-api.xpollens.com');

    // WHEN
    scope.post('/api/V1.1/users/xwAXKChwm/kyc/attachments').reply(200, {
      type: 'ID_CARD',
      status: 'Validated',
      files: [
        {
          name: 'CIN.JPEG',
          key: '80074298-acc9-40bc-9dc8-96a1d32106f8',
        },
      ],
    });
    const eventHandler = new UserKycDecisionUpdatedEventHandler(
      kernel.get(SendKycDocument),
      kernel.get(PaymentIdentifier.kycGateway),
      defaultLogger,
    ).handle(userKycUpdatedEvent);

    await expect(eventHandler).resolves.toBeUndefined();
    expect(sendDocumentSpy).toHaveBeenCalled();
    expect(setFiltersSpy).not.toHaveBeenCalled();
    scope.done();
  });

  it('Should send file with right name when document side is undefined', async () => {
    const scope = nock('https://sb-api.xpollens.com');
    scope.post('/api/V1.1/users/xwAXKChwm/kyc/attachments').reply(200, {
      type: 'ID_CARD',
      status: 'Validated',
      files: [
        {
          name: 'CIN.JPEG',
          key: '80074298-acc9-40bc-9dc8-96a1d32106f8',
        },
      ],
    });
    const userKycUpdatedEvent: UserKycDecisionUpdated = {
      id: 'opaozkeoazek',
      props: {
        ...profileProps,
        kyc: {
          ...profileProps.kyc,
          decision: KycDecisionType.OK_MANUAL,
          politicallyExposed: KycDecisionType.OK,
          sanctioned: KycDecisionType.PENDING_REVIEW,
        },
        documents: [
          {
            location: 'xwAXKChwm/kyc/passport_1607558400000.jpg',
            side: undefined,
            type: DocumentType.PASSPORT,
          },
        ],
      },
      metadata: {
        aggregate: UserKycDecisionUpdated.name,
        aggregateId: 'xwAXKChwm',
      },
    };

    await new UserKycDecisionUpdatedEventHandler(
      kernel.get(SendKycDocument),
      kernel.get(PaymentIdentifier.kycGateway),
      defaultLogger,
    ).handle(userKycUpdatedEvent);

    const callArgument = createDocumentSpy.mock.calls[0][0];
    expect(createDocumentSpy).toHaveBeenCalled();
    expect(callArgument.props.files[0].type).toEqual('passport');

    scope.done();
  });

  it('Should only call setFilters and not sendDocument', async () => {
    const userKycUpdatedEvent: UserKycDecisionUpdated = {
      id: 'poazkezae',
      props: {
        ...profileProps,
        kyc: {
          ...profileProps.kyc,
          decision: KycDecisionType.PENDING_REVIEW,
          sanctioned: KycDecisionType.KO_MANUAL,
          politicallyExposed: KycDecisionType.KO_MANUAL,
        },
      },
      metadata: {
        aggregate: UserKycDecisionUpdated.name,
        aggregateId: 'xwAXKChwm',
      },
    };
    const scope = nock('https://sb-api.xpollens.com');

    scope.patch('/api/V1.1/user/xwAXKChwm/sanctionpperesults').reply(201);
    const eventHandler = new UserKycDecisionUpdatedEventHandler(
      kernel.get(SendKycDocument),
      kernel.get(PaymentIdentifier.kycGateway),
      defaultLogger,
    ).handle(userKycUpdatedEvent);

    await expect(eventHandler).resolves.toBeUndefined();
    expect(sendDocumentSpy).not.toHaveBeenCalled();
    expect(setFiltersSpy).toHaveBeenCalled();
    scope.done();
  });

  it('Should handle message without calling Smoney', async () => {
    //  insert account to be retrieved  in database
    const accountId = 'tstUsr103';

    const event = {
      id: 'poazkeozae',
      props: {
        profileStatus: profileProps.informations.status,
        activationType: ProfileActivationType.TRANSFER,
      },
      metadata: {
        aggregate: ProfileActivated.name,
        aggregateId: accountId,
      },
    };
    const handler = new ProfileActivatedHandler(
      kernel.get(NotifyDiligenceByAggregationToPartner),
      defaultLogger,
    );
    const resultPromise = handler.handle(event);
    await expect(resultPromise).resolves.toBeUndefined();
    expect(notifyAggregUsecaseSpy).not.toBeCalled();
  });

  it('should notify smoney that profile activated by account aggregation when receiving PROFILE_ACTIVATED event', async () => {
    //  insert account to be retrieved  in database
    const accountId = 'tstUsr103';
    await bankAccountRepositoryWriter.save(
      new BankAccount({
        uid: accountId,
        bankAccountId: accountId,
        bic: 'SOGEFRPP',
        iban: 'FR1420041010050500013M02606',
        beneficiaries: [],
        cards: [],
      }),
    );

    const { nockDone } = await nockBack('smoneyComplementaryDiligence.json', { before });

    const event = {
      id: 'poazkeozae',
      props: {
        profileStatus: profileProps.informations.status,
        activationType: ProfileActivationType.AGGREGATION,
      },
      metadata: {
        aggregate: ProfileActivated.name,
        aggregateId: accountId,
      },
    };
    const handler = new ProfileActivatedHandler(
      kernel.get(NotifyDiligenceByAggregationToPartner),
      defaultLogger,
    );

    const resultPromise = handler.handle(event);

    await expect(resultPromise).resolves.toBeUndefined();

    nockDone();
  });

  it('should emit KYC_DILIGENCE_FAILED when smoney create complementary diligence fails', async () => {
    const accountId = 'tstUsr103';
    await bankAccountRepositoryWriter.save(
      new BankAccount({
        uid: accountId,
        bankAccountId: accountId,
        bic: 'SOGEFRPP',
        iban: 'FR1420041010050500013M02606',
        beneficiaries: [],
        cards: [],
      }),
    );

    const eventDispatcherSpy = jest.spyOn(kernel.get(EventDispatcher), 'dispatch');

    nock('https://sb-api.xpollens.com')
      .post('/api/V1.1/users/tstUsr103/kyc/complementarydiligence')
      .reply(500);

    const event = {
      id: 'poazkeozae',
      props: {
        profileId: 'tstUsr103',
        profileStatus: profileProps.informations.status,
        activationType: ProfileActivationType.AGGREGATION,
      },
      metadata: {
        aggregate: ProfileActivated.name,
        aggregateId: 'tstUsr103',
      },
    };
    const handler = new ProfileActivatedHandler(
      kernel.get(NotifyDiligenceByAggregationToPartner),
      defaultLogger,
    );

    const resultPromise = handler.handle(event);

    await expect(resultPromise).rejects.toThrow(NetworkError.ApiResponseError);
    await expect(eventDispatcherSpy).toHaveBeenCalled();

    eventDispatcherSpy.mockRestore();
  });

  it('should retrieve an account with a diligent status and validation method', async () => {
    const accountId = 'tstUsr103';
    const accountIban = 'FR1420041010050500013M02606';
    await bankAccountRepositoryWriter.save(
      new BankAccount({
        uid: accountId,
        bankAccountId: accountId,
        bic: 'SOGEFRPP',
        iban: accountIban,
        beneficiaries: [],
        cards: [],
        kycDiligenceStatus: DiligenceStatus.VALIDATED,
        kycDiligenceValidationMethod: DiligencesType.AGGREGATION,
      }),
    );

    const result = await bankAccountRepositoryReader.findById(accountId);

    await expect(result.props.kycDiligenceStatus).toBe(DiligenceStatus.VALIDATED);
    await expect(result.props.kycDiligenceValidationMethod).toBe(DiligencesType.AGGREGATION);
  });
});
