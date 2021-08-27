/* eslint-disable */
/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { createAzureConnection } from '@oney/az-servicebus-adapters';
import * as nock from 'nock';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';
import {
  DomainDependencies,
  Email,
  GeneratedEchoRequest,
  Invitation,
  RefAuthError,
  StrongAuthVerifier,
  User,
  UserError,
} from '@oney/authentication-core';
import { RefAuthResponseReturnTypeCodes } from '../../adapters/mappers/icg/refauth/IcgRefAuthResponseXmlMapper';
import { testConfiguration } from '../fixtures/config/config';
import { createProfile } from '../fixtures/icgrefauth/profileFactory';
import { createConsultResponsePayload } from '../fixtures/icgrefauth/consultRequestFactory';
import { HonorificCode, ProfileStatus, PhoneStepValidated } from '@oney/profile-messages';
import { CardSent } from '@oney/payment-messages';
import { initializeInMemoryAuthenticationBuildDependencies } from '../fixtures/initializeInMemoryAuthenticationBuildDependencies';
import {
  ciphertext64FromSmoney,
  decryptWithPrivateKey,
  encryptCardDataWithPublicKey,
  ciphertext64GeneratedFromPrivateKey,
} from './fixtures/encryptionFactory';
import { MaybeType } from '@oney/common-core';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

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

describe('ICG RefAuth integration testing', () => {
  let kernel: AuthenticationBuildDependencies;
  let dependencies: DomainDependencies;
  let userId: string;
  let mockPhoneStepEventPayload: PhoneStepValidated;
  let mockLegacyPhoneStepEventPayload: PhoneStepValidated;
  let mockLegacyWithPhoneInMetadataPhoneStepEventPayload: PhoneStepValidated;
  let mockLegacyNotProvisionedPhoneStepEventPayload: PhoneStepValidated;
  let mockCardSentEventPayload: CardSent;
  let provisioningResponseBodyGenerate: (x: unknown) => string;
  let userEmail: Email;
  let cardId: string;
  let generatedEchoRequest: GeneratedEchoRequest;
  let refauthPathWithCompanyCode: string;
  let userWithFailedPhoneProvisioningId: string;
  let userWithFailedPhoneProvisioningEmail: Email;
  let userWithNoProvisioningWhenAcsProvId: string;
  let provisionedLegacyUserId: string;
  let provisionedLegacyUserWitPhoneInhMetadataId: string;
  let legacyUserNotProvisionedId: string;
  let userWithNoProvisioningWhenAcsProvEmail: Email;
  const decryptionMethodName = 'decryptWithPrivateKey';
  const privateDecryptionMethodName = '_attemptDecryption';
  const validTestPlaintextPan = '4539588089085589'; // https://www.freeformatter.com/credit-card-number-generator-validator.html

  beforeAll(async () => {
    // await SecretService.loadSecrets();
    const userMap = new Map<string, User>();
    userId = 'ci_test_user';
    userEmail = Email.from('ci_npm_tests@test.test');
    userWithFailedPhoneProvisioningId = 'ci_test_user_failed_phone_provision';
    userWithFailedPhoneProvisioningEmail = Email.from('failed_phone_prov@failedphoneprov.fr');
    userWithNoProvisioningWhenAcsProvId = 'ci_test_user_no_provision';
    provisionedLegacyUserId = 'ci_test_legacy_user';
    provisionedLegacyUserWitPhoneInhMetadataId = 'ci_test_legacy_user_phone_metadata';
    legacyUserNotProvisionedId = 'ci_test_legacy_user_no_prov';
    userWithNoProvisioningWhenAcsProvEmail = Email.from('no_prov@noprov.fr');

    userMap.set(
      userId,
      new User({
        uid: userId,
        pinCode: null,
        email: userEmail,
        phone: null,
      }),
    );

    userMap.set(
      userWithFailedPhoneProvisioningId,
      new User({
        uid: userWithFailedPhoneProvisioningId,
        pinCode: null,
        email: userWithFailedPhoneProvisioningEmail,
        phone: null,
        provisioning: null,
      }),
    );

    userMap.set(
      userWithNoProvisioningWhenAcsProvId,
      new User({
        uid: userWithNoProvisioningWhenAcsProvId,
        pinCode: null,
        email: userWithNoProvisioningWhenAcsProvEmail,
        phone: null,
      }),
    );

    userMap.set(
      provisionedLegacyUserId,
      new User({
        uid: provisionedLegacyUserId,
        pinCode: null,
        email: Email.from(`${provisionedLegacyUserId}@mail.com`),
        phone: true as any,
      }),
    );

    userMap.set(
      provisionedLegacyUserWitPhoneInhMetadataId,
      new User({
        uid: provisionedLegacyUserWitPhoneInhMetadataId,
        pinCode: null,
        email: Email.from(`${provisionedLegacyUserWitPhoneInhMetadataId}@mail.com`),
        phone: true as any,
        metadata: {
          phone: '0101010101',
        },
      }),
    );

    userMap.set(
      legacyUserNotProvisionedId,
      new User({
        uid: legacyUserNotProvisionedId,
        pinCode: null,
        email: Email.from(`${legacyUserNotProvisionedId}@mail.com`),
        phone: false as any,
      }),
    );

    cardId = 'card-akye-PAhW';

    kernel = (await initializeInMemoryAuthenticationBuildDependencies({ userMap })).kernel;

    dependencies = kernel.getDependencies();

    mockPhoneStepEventPayload = {
      id: 'some-id-phone-step-validated-event',
      props: {
        phone: '+33678299081',
      },
      metadata: {
        aggregateId: userId,
        aggregate: 'toto',
        eventName: 'PHONE_STEP_VALIDATED',
      },
    };

    mockLegacyPhoneStepEventPayload = {
      id: 'some-id-phone-step-validated-event',
      props: {
        phone: '+33678299081',
      },
      metadata: {
        aggregateId: provisionedLegacyUserId,
        aggregate: 'toto',
        eventName: 'PHONE_STEP_VALIDATED',
      },
    };

    mockLegacyWithPhoneInMetadataPhoneStepEventPayload = {
      id: 'some-id-phone-step-validated-event',
      props: {
        phone: '0101010101',
      },
      metadata: {
        aggregateId: provisionedLegacyUserWitPhoneInhMetadataId,
        aggregate: 'toto',
        eventName: 'PHONE_STEP_VALIDATED',
      },
    };

    mockLegacyNotProvisionedPhoneStepEventPayload = {
      id: 'some-id-phone-step-validated-event',
      props: {
        phone: '0202020202',
      },
      metadata: {
        aggregateId: legacyUserNotProvisionedId,
        aggregate: 'toto',
        eventName: 'PHONE_STEP_VALIDATED',
      },
    };

    const ciphertext64 = encryptCardDataWithPublicKey();
    mockCardSentEventPayload = {
      id: 'some-id-card-sent-event',
      props: { cardId, userId, encryptedData: ciphertext64 },
      metadata: {
        aggregateId: userId,
        aggregate: 'titi',
        eventName: 'CARD_SENT',
      },
    };

    provisioningResponseBodyGenerate = (returnCode: RefAuthResponseReturnTypeCodes) =>
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Header><peg:groupContext xmlns:peg="http://www.bpce.fr/xsd/peg/PEG_v0">' +
      '<peg:requestContext><peg:requestId>48f01c19-d5ce-4994-bca8-16242b5165b8</peg:requestId>' +
      '</peg:requestContext><peg:consumerContext><peg:application><peg:name>BD-FRA</peg:name><peg:version>1.0</peg:version>' +
      '<peg:organisation>ONEY</peg:organisation></peg:application><peg:run><peg:companyCode>12869</peg:companyCode></peg:run>' +
      '</peg:consumerContext><peg:goalContext/></peg:groupContext></soap:Header><soap:Body>' +
      '<ns2:provisionnerClientResponse xmlns:ns2="http://mod_ICG_refAuth_Lib_Export/mod_ICG_refAuth" xmlns:ns3="http://www.bpce.fr/xsd/peg/PEG_v0">' +
      `<RepnEnrlClnt><BlocRetr><CdTypeRetr>${returnCode}</CdTypeRetr></BlocRetr></RepnEnrlClnt></ns2:provisionnerClientResponse></soap:Body></soap:Envelope>`;

    nock.disableNetConnect();

    generatedEchoRequest = await dependencies.getEchoRequestGenerator.generate({ uid: 'health_check_id' });
    refauthPathWithCompanyCode = testConfiguration.icgConfig.icgRefAuthPath.replace(
      '$companyCode',
      testConfiguration.icgConfig.odbCompanyCode,
    );
  });

  beforeEach(async () => {
    nock.cleanAll.bind(nock);
    nock.cleanAll();
  });

  it('should get ICG refauth certificates as envirinment variables', async () => {
    expect(testConfiguration.secretService.caCert.length > 50).toBeTruthy();
    expect(testConfiguration.secretService.clientCert.length > 50).toBeTruthy();
    expect(testConfiguration.secretService.clientPrivKey.length > 50).toBeTruthy();
    expect(testConfiguration.icgConfig.odbCompanyCode).toBeTruthy();
    expect(testConfiguration.cardLifecycleFunctionTopic).toBeTruthy();
  });

  it('should trigger ICG provisioning on phone step event and set provisioning field on user', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    await dependencies.getPhoneStep.handle(mockPhoneStepEventPayload);
    const maybeResult = await dependencies.userRepository.getById(userId);
    if (maybeResult.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const result = maybeResult.value;
    await expect(result.props.phone).toBeTruthy();
    await expect(result.props.provisioning.phone.success).toBeTruthy();
    await expect(result.props.provisioning.phone.date).toBeTruthy();
    await expect(result.props.phone).toBeTruthy();
    await expect(result.props.phone).toMatch('+33678299081');
  });

  it('should trigger ICG provisioning on phone step event for provisioned legacy user', async () => {
    jest.setTimeout(35000);
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    await dependencies.getPhoneStep.handle(mockLegacyPhoneStepEventPayload);
    const maybeResult = await dependencies.userRepository.getById(provisionedLegacyUserId);
    if (maybeResult.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const result = maybeResult.value;
    await expect(result.props.phone).toBeTruthy();
    await expect(result.props.provisioning.phone.success).toBeTruthy();
    await expect(result.props.provisioning.phone.date).toBeTruthy();
    await expect(result.props.phone).toBeTruthy();
    await expect(result.props.phone).toMatch('+33678299081');
  });

  it('should trigger ICG provisioning on phone step event for provisioned legacy user with phone in metadata', async () => {
    jest.setTimeout(35000);
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    await dependencies.getPhoneStep.handle(mockLegacyWithPhoneInMetadataPhoneStepEventPayload);
    const maybeResult = await dependencies.userRepository.getById(provisionedLegacyUserWitPhoneInhMetadataId);
    if (maybeResult.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const result = maybeResult.value;
    await expect(result.props.phone).toBeTruthy();
    await expect(result.props.provisioning.phone.success).toBeTruthy();
    await expect(result.props.provisioning.phone.date).toBeTruthy();
    await expect(result.props.phone).toBeTruthy();
    await expect(result.props.phone).toMatch('0101010101');
  });

  it('should trigger ICG provisioning on phone step event for legacy user not provisioned', async () => {
    jest.setTimeout(35000);
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    await dependencies.getPhoneStep.handle(mockLegacyNotProvisionedPhoneStepEventPayload);
    const maybeResult = await dependencies.userRepository.getById(legacyUserNotProvisionedId);
    if (maybeResult.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const result = maybeResult.value;
    await expect(result.props.phone).toBeTruthy();
    await expect(result.props.provisioning.phone.success).toBeTruthy();
    await expect(result.props.provisioning.phone.date).toBeTruthy();
    await expect(result.props.phone).toBeTruthy();
    await expect(result.props.phone).toMatch('0202020202');
  });

  it('should throw an error when fail parsing XML response', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl).post(refauthPathWithCompanyCode).reply(200, null);

    const resultPromise = dependencies.getPhoneStep.handle(mockPhoneStepEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionFailTransientError);
  });

  it('should throw REFAUTH_PROVISION_CLIENT_FAIL_WITH_ALERT when phone provisioning ALERT and not update the phone provisioning field on user when already successful once', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.ALERT));

    const resultPromise = dependencies.getPhoneStep.handle(mockPhoneStepEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithAlert);

    const maybeUser = await dependencies.userRepository.getById(userId);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning).toBeTruthy();
    await expect(user.props.provisioning.phone.success).toBeTruthy();
    await expect(user.props.provisioning.phone.date).toBeTruthy();
  });

  it('should throw REFAUTH_PROVISION_CLIENT_FAIL_WITH_ALERT when phone provisioning ALERT', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.ALERT));

    // set user without provisioning
    const noProv1Id = 'no_prov_1';
    const noProv1User = new User({
      uid: noProv1Id,
      email: Email.from('noProv1Id@noProv1Id.fd'),
      phone: null,
    });
    await dependencies.userRepository.save(noProv1User);

    const noProv1MockPhoneEvent: PhoneStepValidated = {
      ...mockPhoneStepEventPayload,
      metadata: {
        ...mockPhoneStepEventPayload.metadata,
        aggregateId: noProv1Id,
      },
    };

    const resultPromise = dependencies.getPhoneStep.handle(noProv1MockPhoneEvent);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithAlert);

    const maybeUser = await dependencies.userRepository.getById(noProv1Id);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.phone).toBeFalsy();
    await expect(user.props.provisioning).toBeFalsy();
  });

  it('should throw REFAUTH_PROVISION_CLIENT_FAIL_WITH_TECHNICAL_ERROR when client provisioning return with TECHNICAL_ERROR', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.TECHNICAL_ERROR));

    const resultPromise = dependencies.getPhoneStep.handle(mockPhoneStepEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithTechnicalError);
  });

  it('should throw REFAUTH_PROVISION_CLIENT_FAIL_WITH_REQUEST_ERROR when client provisioning return with  REQUEST_ERROR', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.REQUEST_ERROR));

    const resultPromise = dependencies.getPhoneStep.handle(mockPhoneStepEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithRequestError);
  });

  it('should throw REFAUTH_PROVISION_CLIENT_FAIL_WITH_CONTRACT_EXECUTION_ERROR when client provisioning return with CONTRACT_EXECUTION_ERROR', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.CONTRACT_EXECUTION_ERROR));

    const resultPromise = dependencies.getPhoneStep.handle(mockPhoneStepEventPayload);

    await expect(resultPromise).rejects.toThrow(
      RefAuthError.ProvisioningClientFailWithContractExecutionError,
    );
  });

  it('should throw REFAUTH_PROVISION_CLIENT_FAIL  WITH UNKNOWN CODE when client provisioning return with an undocumented error code', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate('55'));

    const resultPromise = dependencies.getPhoneStep.handle(mockPhoneStepEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithUnknownCode);
  });

  it('should listen for CARD_SENT event from service bus and set provisioning acs field on user', async () => {
    const decryptionMethodSpy = jest.spyOn<any, any>(
      (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway._encryptionGateway,
      decryptionMethodName,
    );

    const pricateDecryptionMethodMock = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        privateDecryptionMethodName,
      )
      .mockImplementationOnce(() => decryptWithPrivateKey());

    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    await dependencies.getUserCardProvisioningHandler.handle({
      ...mockCardSentEventPayload,
      props: { ...mockCardSentEventPayload.props, encryptedData: ciphertext64FromSmoney },
    });

    // test decryption of encrypted card data from bus

    const [{ type, value }] = decryptionMethodSpy.mock.results;
    const decryptedData = await value;

    await expect(type).toEqual('return');
    await expect(JSON.parse(decryptedData).primaryAccountNumber).toEqual(validTestPlaintextPan);

    const maybeUser = await dependencies.userRepository.getById(userId);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning.card.success).toBeTruthy();
    await expect(user.props.provisioning.card.date).toBeTruthy();

    decryptionMethodSpy.mockRestore();
    pricateDecryptionMethodMock.mockRestore();
  });

  it('should listen for CARD_SENT event from service bus and provision phone for user not provisionned on auth partner, before the acs provisioning', async () => {
    const decryptionMethodSpy = jest.spyOn<any, any>(
      (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway._encryptionGateway,
      decryptionMethodName,
    );

    const userNoProv4Id = 'not_exist_on_auth_partner';
    const userNoProv4IdUser = new User({
      uid: userNoProv4Id,
      email: Email.from('userNoProv4IdUser@to.df'),
      phone: null,
    });
    await dependencies.userRepository.save(userNoProv4IdUser);

    const userNoProv4IdMockCardSentEventPayload: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: userNoProv4Id,
        encryptedData: ciphertext64GeneratedFromPrivateKey,
      },
    };

    // mock consult request return user not exist on auth partner
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.ALERT));

    // mock request to profile service to get user data to provision him with phone
    nock(testConfiguration.frontDoorApiBaseUrl)
      .get(`/profile/user/${userNoProv4Id}`)
      .reply(200, createProfile(userNoProv4Id, HonorificCode.MALE, ProfileStatus.ACTIVE));

    // make request to provision user with phone
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    await dependencies.getUserCardProvisioningHandler.handle(userNoProv4IdMockCardSentEventPayload);

    // test decryption of encrypted card data from bus

    const [{ type, value }] = decryptionMethodSpy.mock.results;
    const decryptedData = await value;

    await expect(type).toEqual('return');
    await expect(JSON.parse(decryptedData).primaryAccountNumber).toEqual(validTestPlaintextPan);

    const maybeUser = await dependencies.userRepository.getById(userNoProv4Id);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning.phone.success).toBeTruthy();
    await expect(user.props.provisioning.phone.date).toBeTruthy();
    await expect(user.props.provisioning.card.success).toBeTruthy();
    await expect(user.props.provisioning.card.date).toBeTruthy();

    decryptionMethodSpy.mockRestore();
  });

  it('should fail to provision card beceause card decryption error other than padding error', async () => {
    const decryptionMethodSpy = jest.spyOn<any, any>(
      (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway._encryptionGateway,
      decryptionMethodName,
    );
    const retryBoolMock = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        '_isPadding',
      )
      .mockImplementation(() => false);

    const userNoProv4Id = 'not_exist_on_auth_partner';
    const userNoProv4IdUser = new User({
      uid: userNoProv4Id,
      email: Email.from('userNoProv4IdUser@to.df'),
      phone: null,
    });
    await dependencies.userRepository.save(userNoProv4IdUser);

    const userNoProv4IdMockCardSentEventPayload: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: userNoProv4Id,
        encryptedData: decryptWithPrivateKey(),
      },
    };

    // mock consult request return user not exist on auth partner
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.ALERT));

    // mock request to profile service to get user data to provision him with phone
    nock(testConfiguration.frontDoorApiBaseUrl)
      .get(`/profile/user/${userNoProv4Id}`)
      .reply(200, createProfile(userNoProv4Id, HonorificCode.MALE, ProfileStatus.ACTIVE));

    // make request to provision user with phone
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(
      userNoProv4IdMockCardSentEventPayload,
    );

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionFailWithCardDataDecryptionError);

    decryptionMethodSpy.mockRestore();
    retryBoolMock.mockRestore();
  });

  it('should provision acs for legacy user already provisionned with phone but without provisioning field', async () => {
    const decryptionMethodSpy = jest.spyOn<any, any>(
      (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway._encryptionGateway,
      decryptionMethodName,
    );

    const pricateDecryptionMethodMock = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        privateDecryptionMethodName,
      )
      .mockImplementationOnce(() => decryptWithPrivateKey());

    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    // mock request to profile service to get user data to provision him with phone
    nock(testConfiguration.frontDoorApiBaseUrl)
      .get(`/profile/user/${userWithNoProvisioningWhenAcsProvId}`)
      .reply(
        200,
        createProfile(userWithNoProvisioningWhenAcsProvId, HonorificCode.MALE, ProfileStatus.ACTIVE),
      );

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.OK));

    const maybeUser = await dependencies.userRepository.getById(userWithNoProvisioningWhenAcsProvId);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const _user = maybeUser.value;
    expect(_user.props.provisioning).toBeUndefined();

    const mockCardSentEventWithUserNotProvisionned: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: userWithNoProvisioningWhenAcsProvId,
        encryptedData: ciphertext64FromSmoney,
      },
    };

    await dependencies.getUserCardProvisioningHandler.handle(mockCardSentEventWithUserNotProvisionned);

    // test decryption of encrypted card data from bus

    const [{ type, value }] = decryptionMethodSpy.mock.results;
    const decryptedData = await value;

    await expect(type).toEqual('return');
    await expect(JSON.parse(decryptedData).primaryAccountNumber).toEqual(validTestPlaintextPan);

    const maybeResult = await dependencies.userRepository.getById(userWithNoProvisioningWhenAcsProvId);
    if (maybeResult.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const result = maybeResult.value;
    await expect(result.props.provisioning).toBeTruthy();
    await expect(result.props.provisioning.phone.success).toBeTruthy();
    await expect(result.props.provisioning.card.success).toBeTruthy();

    decryptionMethodSpy.mockRestore();
    pricateDecryptionMethodMock.mockRestore();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_CARD_DATA_DECRYPTION_ERROR error when card data decryption error', async () => {
    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    const randomId = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const randomPhone = Math.floor(100000 + Math.random() * 9000000000);
    const randomUser = new User({
      uid: randomId,
      email: Email.from(`${randomId}@rand.om`),
      phone: `${randomPhone}`,
      provisioning: {
        partnerUid: `12869@${randomId}`,
        phone: { success: true, date: new Date() },
      },
    });

    await dependencies.userRepository.save(randomUser);

    const mockCardSentEventPayloadWithEncryptionError: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: randomId,
        // incorrectly encrypted data
        encryptedData:
          'NbLZkINoICe7LIteGLrX3IqDTtHp3G8VZa2eZ3CjccwlBXnzPCx6EchTL6B9tQsUUwTj4WeJ59S3KSmaw8wuihcl' +
          'MExsEwrJoY8C4ZVt38QeAD/Bzgzmi59blFnMWUcSxcKcubUDzW0m21TpX7CSzmWZQ6cLNAK7M2MFyIxD5FuJMsa4/lsEnYylPe1PR' +
          'DDSEsyc4RzWqvMg7clpI35O8Y1XEry3gMiiSGu/qqPTbxNOKND6Cj7nAzJFHMqBUIJ2jPPGqppGN6CfvJ+htxE9JRWK83hTNgQx7p' +
          'wKTakYRMbPSgyIHiGDMaBqMRuA7uAZgIdj4+VUaFHowJBhvBYwaPVrrXT4IC3evk6NqfBPYLHxjyJ6WqSwCHBJa/yQRbSUMlMMc' +
          'r/YfHXn6+dSRJHWrNKyaLsxYwKHIGexv4fo3HqDT9vfAx9ICvnaiJAFxzaJG1VTUOxN/7UiyXa6ev6uLlxlXsqagICwG3bcBOcM' +
          'ApJqJ9qLfWqh2jQnged/g/uHAxNGhRlPmoduOzLlUzeWWJE1yQ7Sdi5tPb9kysBxw6XZU0QRwg28kj93NKJaiKMh8otf4V3sjZQ' +
          'i9nzediRIuldmp1FESy16jRt9Ok6SQ6n4MHGT2IFPtpYApAMqeH29rEY9cChRzIPgARcxNgCT5cRDlVhqITuzYYsrr8c2QHA=',
      },
    };

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(
      mockCardSentEventPayloadWithEncryptionError,
    );
    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionFailWithCardDataDecryptionError);

    const maybeUser = await dependencies.userRepository.getById(randomId);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning.card).toBeFalsy();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_CARD_DATA_DECRYPTION_ERROR error when card data decryption error for legacy user', async () => {
    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    const randomId = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

    // mock request to profile service to get user data to provision him with phone
    nock(testConfiguration.frontDoorApiBaseUrl)
      .get(`/profile/user/${randomId}`)
      .reply(200, createProfile(randomId, HonorificCode.MALE, ProfileStatus.ACTIVE));

    const randomPhone = Math.floor(100000 + Math.random() * 9000000000);
    const legacyRandomUser = new User({
      uid: randomId,
      email: Email.from(`${randomId}@rand.om`),
      phone: '0612345678',
    });

    await dependencies.userRepository.save(legacyRandomUser);

    const mockCardSentEventPayloadWithEncryptionError: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: randomId,
        // incorrectly encrypted data
        encryptedData:
          'NbLZkINoICe7LIteGLrX3IqDTtHp3G8VZa2eZ3CjccwlBXnzPCx6EchTL6B9tQsUUwTj4WeJ59S3KSmaw8wuihcl' +
          'MExsEwrJoY8C4ZVt38QeAD/Bzgzmi59blFnMWUcSxcKcubUDzW0m21TpX7CSzmWZQ6cLNAK7M2MFyIxD5FuJMsa4/lsEnYylPe1PR' +
          'DDSEsyc4RzWqvMg7clpI35O8Y1XEry3gMiiSGu/qqPTbxNOKND6Cj7nAzJFHMqBUIJ2jPPGqppGN6CfvJ+htxE9JRWK83hTNgQx7p' +
          'wKTakYRMbPSgyIHiGDMaBqMRuA7uAZgIdj4+VUaFHowJBhvBYwaPVrrXT4IC3evk6NqfBPYLHxjyJ6WqSwCHBJa/yQRbSUMlMMc' +
          'r/YfHXn6+dSRJHWrNKyaLsxYwKHIGexv4fo3HqDT9vfAx9ICvnaiJAFxzaJG1VTUOxN/7UiyXa6ev6uLlxlXsqagICwG3bcBOcM' +
          'ApJqJ9qLfWqh2jQnged/g/uHAxNGhRlPmoduOzLlUzeWWJE1yQ7Sdi5tPb9kysBxw6XZU0QRwg28kj93NKJaiKMh8otf4V3sjZQ' +
          'i9nzediRIuldmp1FESy16jRt9Ok6SQ6n4MHGT2IFPtpYApAMqeH29rEY9cChRzIPgARcxNgCT5cRDlVhqITuzYYsrr8c2QHA=',
      },
    };

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(
      mockCardSentEventPayloadWithEncryptionError,
    );
    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionFailWithCardDataDecryptionError);

    const maybeUser = await dependencies.userRepository.getById(randomId);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning).toBeFalsy();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_CARD_DATA_DECRYPTION_ERROR error when no PAN in decrypted data and set provisioning acs field with failure', async () => {
    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    const randomId = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const randomPhone = Math.floor(100000 + Math.random() * 9000000000);
    const randomUser = new User({
      uid: randomId,
      email: Email.from(`${randomId}@rand.om`),
      phone: `${randomPhone}`,
      provisioning: {
        partnerUid: `12869@${randomId}`,
        phone: { success: true, date: new Date() },
      },
    });

    await dependencies.userRepository.save(randomUser);

    const mockCardSentEventPayloadNoEncryptedData: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: randomId,
        encryptedData: '',
      },
    };

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(
      mockCardSentEventPayloadNoEncryptedData,
    );

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionFailWithCardDataDecryptionError);
    const maybeUser = await dependencies.userRepository.getById(randomId);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning).toBeTruthy();
    await expect(user.props.provisioning.card).toBeFalsy();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_CARD_DATA_DECRYPTION_ERROR error when no encrypted data in CARD_SENT event', async () => {
    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    const randomId = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const randomPhone = Math.floor(100000 + Math.random() * 9000000000);
    const randomUser = new User({
      uid: randomId,
      email: Email.from(`${randomId}@rand.om`),
      phone: `${randomPhone}`,
      provisioning: {
        partnerUid: `12869@${randomId}`,
        phone: { success: true, date: new Date() },
      },
    });

    await dependencies.userRepository.save(randomUser);

    const mockCardSentEventPayloadNoEncryptedData: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: randomId,
        encryptedData: '',
      },
    };

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(
      mockCardSentEventPayloadNoEncryptedData,
    );

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionFailWithCardDataDecryptionError);

    const maybeUser = await dependencies.userRepository.getById(randomId);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning.card).toBeFalsy();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_ALERT error when ACS adding fails with alert', async () => {
    const spy = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        decryptionMethodName,
      )
      .mockImplementationOnce(() => decryptWithPrivateKey());

    const userNoPreviousAcsSuccess1Id = 'no_prev_acs_success_1';
    const userNoPreviousAcsSuccess1IdUser = new User({
      uid: userNoPreviousAcsSuccess1Id,
      email: Email.from('userNoPreviousAcsSuccess1Id@userNoPreviousAcsSuccess1Id.to'),
      phone: '0612345678',
      provisioning: {
        partnerUid: `12869@${userNoPreviousAcsSuccess1Id}`,
        phone: {
          success: true,
          date: new Date(),
        },
      },
    });
    await dependencies.userRepository.save(userNoPreviousAcsSuccess1IdUser);

    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.ALERT));

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(mockCardSentEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithAlert);

    const maybeUser = await dependencies.userRepository.getById(userNoPreviousAcsSuccess1Id);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning.phone.success).toBeTruthy();
    await expect(user.props.provisioning.phone.date).toBeTruthy();
    await expect(user.props.provisioning.card).toBeFalsy();

    spy.mockRestore();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_ALERT error when ACS adding fails with alert for legacy user', async () => {
    const spy = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        decryptionMethodName,
      )
      .mockImplementationOnce(() => decryptWithPrivateKey());

    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    const legacyUserNoProv3Id = 'no_prov_3';

    // mock request to profile service to get user data to provision him with phone
    nock(testConfiguration.frontDoorApiBaseUrl)
      .get(`/profile/user/${legacyUserNoProv3Id}`)
      .reply(200, createProfile(legacyUserNoProv3Id, HonorificCode.MALE, ProfileStatus.ACTIVE));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.ALERT));

    const legacyUserNoProv3User = new User({
      uid: legacyUserNoProv3Id,
      email: Email.from('legacyUserNoProv3Id@noProv3Id.df'),
      phone: '0612345678',
    });
    await dependencies.userRepository.save(legacyUserNoProv3User);

    const noProv3MockCardSentEventPayload: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: legacyUserNoProv3Id,
      },
    };

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(noProv3MockCardSentEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithAlert);

    const maybeUser = await dependencies.userRepository.getById(legacyUserNoProv3Id);
    if (maybeUser.type === MaybeType.Nothing) throw new UserError.UserNotFound('User not found');

    const user = maybeUser.value;
    await expect(user.props.provisioning).toBeFalsy();

    spy.mockRestore();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_TECHNICAL_ERROR error when ACS adding fails with technical error', async () => {
    const spy = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        decryptionMethodName,
      )
      .mockImplementationOnce(() => decryptWithPrivateKey());

    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.TECHNICAL_ERROR));

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(mockCardSentEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithTechnicalError);

    spy.mockRestore();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_REQUEST_ERROR error when ACS adding fails with request error', async () => {
    const spy = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        decryptionMethodName,
      )
      .mockImplementationOnce(() => decryptWithPrivateKey());

    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.REQUEST_ERROR));

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(mockCardSentEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithRequestError);

    spy.mockRestore();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_CONTRACT_EXECUTION_ERROR error when ACS adding fails with execution contract error', async () => {
    const spy = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        decryptionMethodName,
      )
      .mockImplementationOnce(() => decryptWithPrivateKey());

    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate(RefAuthResponseReturnTypeCodes.CONTRACT_EXECUTION_ERROR));

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(mockCardSentEventPayload);

    await expect(resultPromise).rejects.toThrow(
      RefAuthError.ProvisioningClientFailWithContractExecutionError,
    );

    spy.mockRestore();
  });

  it('should send PROVISION_FAIL_ADDING_ACS_WITH_UNKNOWN CODE error when ACS adding fails with unknown code error', async () => {
    const spy = jest
      .spyOn<any, any>(
        (dependencies.getUserCardProvisioningHandler as any)._provisionUserCard._cardGateway
          ._encryptionGateway,
        decryptionMethodName,
      )
      .mockImplementationOnce(() => decryptWithPrivateKey());

    // make consult request to check if user has phone provisionned
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, createConsultResponsePayload(RefAuthResponseReturnTypeCodes.OK));

    // make provisioning request to add ACS application
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode)
      .reply(200, provisioningResponseBodyGenerate('44'));

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(mockCardSentEventPayload);

    await expect(resultPromise).rejects.toThrow(RefAuthError.ProvisionClientFailWithUnknownCode);

    spy.mockRestore();
  });

  it('should throw an error when uid from CARD_SENT event does not exist in authentication database', async () => {
    const mockCardSentEventPayloadWithUserNotExist: CardSent = {
      ...mockCardSentEventPayload,
      props: {
        ...mockCardSentEventPayload.props,
        userId: 'ci_test_user_toto',
      },
    };

    const resultPromise = dependencies.getUserCardProvisioningHandler.handle(
      mockCardSentEventPayloadWithUserNotExist,
    );

    await expect(resultPromise).rejects.toThrow(UserError.UserNotFound);
  });

  it('should handle ICG echo request', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode, generatedEchoRequest.echoRequest)
      .reply(200, `<CdTypeRetr>${RefAuthResponseReturnTypeCodes.OK}</CdTypeRetr>`);

    const { authResponse } = await dependencies.getAuthRequestHandler.handleRequest(
      generatedEchoRequest as any,
    );
    expect(authResponse['CdTypeRetr']).toMatch(RefAuthResponseReturnTypeCodes.OK);
  });

  it('should fail ICG echo request', async () => {
    nock(testConfiguration.icgConfig.icgRefAuthBaseUrl)
      .post(refauthPathWithCompanyCode, generatedEchoRequest.echoRequest)
      .reply(200, `<CdTypeRetr>${RefAuthResponseReturnTypeCodes.REQUEST_ERROR}</CdTypeRetr>`);

    const { authResponse } = await dependencies.getAuthRequestHandler.handleRequest(
      generatedEchoRequest as any,
    );
    expect(authResponse['CdTypeRetr']).toMatch(RefAuthResponseReturnTypeCodes.REQUEST_ERROR);
  });

  afterAll(async done => {
    nock.cleanAll();
    nock.enableNetConnect();
    done();
  });
});
