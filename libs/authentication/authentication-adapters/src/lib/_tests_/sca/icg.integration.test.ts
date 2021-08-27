/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  AuthenticationError,
  AuthFactor,
  AuthIdentifier,
  AuthStatus,
  AuthValidationResonseHandler,
  Channel,
  DefaultDomainErrorMessages,
  DefaultUiErrorMessages,
  DomainDependencies,
  sanitizeErrorMessage,
  UserRepository,
  VerifierRepository,
} from '@oney/authentication-core';
import * as nock from 'nock';
import { from } from 'rxjs';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';
import { testConfiguration } from '../fixtures/config/config';
import {
  generateRandomId,
  generateSamlAuthInitResponseHeaders,
  generateGenericNockQueryMatcher,
  generateAuthInitRedirectResponseHeaders,
  generateAuthInitRedirectResponsePayloadContextPart,
  generateAuthInitRedirectResponseSmsPayload,
  generateAuthInitRedirectResponseUnknownPayload,
  generateAuthInitRedirectResponseCloudcardPayload,
  generateRedirectExceedResponsePayload,
  generateRedirectUnknownUserResponsePayload,
  generateSamlAuthInitResponseHeadersWithRedirect,
  generateAuthInitRedirectResponseFullHeaders,
  generateRandomExpiredSmsVerifierBeforeVerify,
  generateRandomExpiredCloudcardVerifierBeforeVerify,
  generateAuthVerifySuccessWithSamlResponse,
  generateFailedSmsVerifyResponseLessThan3Times,
  generateLockedSmsVerifyResponseAfter3FailedRetriesPayload,
  generateLockedSmsVerifyResponseAfter7FailedRetriesPayload,
  generateRandomBlockedSmsVerifier,
  generateCloudcardVerifyClearanceRejectedResponsePayload,
  generateLockedCloudcardVerifyResponseAfter3FailedRetriesPayload,
  generateFailedCloudcardVerifyResponseLessThan3TimesPayload,
  generateGenericFailedAuthRedirectResponsePayload,
  generateSmsProviderErrorRedirectResponsePayload,
  _setupRandomUser,
  _setupRandomAuthInitRedirectPath,
  _setupRandomVerifyPath,
  _setupRandomSmsVerifierWithMetadata,
  generateLockedAuthRedirectResponseWhileUserLockedPayload,
  _setupCloudVerifierWithMetadata,
  _matchSmsAuthRequestPayload,
  _matchCloudcardAuthRequestPayload,
  generateRandomSmsOtpLenght8,
  generateAuthVerifySuccessWithUnsignedSamlResponse,
  generateAuthVerifySuccessWithSamlResponseWithInvalidSignature,
  _setupRandomSmsVerifierWithMetadataAndUnknownAuthFactor,
} from '../fixtures/icgrefauth/scaFactories';
import { StrongAuthVerifierMetadata } from '../../adapters/types/icg/StrongAuthVerifierMetadata';
import { initializeMongoDbAuthenticationBuildDependencies } from '../fixtures/initializeMongoDbAuthenticationBuildDependencies';
import { IcgAuthValidationResponseHandler } from '../../adapters/handlers/IcgAuthValidationResponseHandler';

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

describe('Strong Customer Authentication usecases integration testing with in memory mongo', () => {
  const { icgBaseUrl, icgVerifyPath, icgSamlPath } = testConfiguration.icgConfig;
  const icgAuthSamlPath = icgSamlPath;
  let odbCertConfig: {
    odbSignCert64: string;
    odbSignCertPass: string;
  };
  let icgAuthBaseUrl: URL;
  let odbSignCert64: string;
  let odbSignCertPass: string;
  let userRepo: UserRepository;
  let verifierRepo: VerifierRepository;
  let kernel: AuthenticationBuildDependencies;
  let dependencies: DomainDependencies;

  beforeAll(async () => {
    odbCertConfig = {
      odbSignCert64: testConfiguration.secretService.odbSignCert,
      odbSignCertPass: testConfiguration.secretService.odbSignCertPass,
    };
    icgAuthBaseUrl = new URL(icgBaseUrl);
    odbSignCert64 = odbCertConfig.odbSignCert64;
    odbSignCertPass = odbCertConfig.odbSignCertPass;

    kernel = (await initializeMongoDbAuthenticationBuildDependencies()).kernel;

    dependencies = kernel.getDependencies();
    verifierRepo = dependencies.verifierRepository;
    userRepo = dependencies.userRepository;
  });

  beforeEach(async () => {
    nock.cleanAll.bind(nock);
    nock.cleanAll();
  });

  it('should get ICG configuration environment variables and ODB signing certificate secrets', async () => {
    const icgConf = testConfiguration.icgConfig;
    await expect(icgConf.icgApplication).toBeTruthy();
    await expect(icgConf.icgContextId).toBeTruthy();
    await expect(icgConf.icgBaseUrl).toBeTruthy();
    await expect(icgConf.icgSamlPath).toBeTruthy();
    await expect(icgConf.icgVerifyPath).toBeTruthy();
    await expect(icgConf.odbSigAlgUrl).toBeTruthy();
    await expect(odbSignCert64).toBeTruthy();
    await expect(odbSignCertPass).toBeTruthy();
  });

  it('Should generate SMS verifier with ICG auth init redirection with cookies', async () => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);
    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeaders(redirectPathname))
      .get(redirectPathname)
      .reply(
        200,
        generateAuthInitRedirectResponseSmsPayload(randomVerifierId),
        generateAuthInitRedirectResponseHeaders(),
      );

    const result = await dependencies.requestSca.execute({ userId: randomUser.props.uid });

    await expect(result.factor).toMatch(AuthFactor.OTP);
    await expect(result.channel).toMatch(Channel.SMS);
    await expect(result.status).toMatch(AuthStatus.PENDING);
    await expect(result.customer.email).toEqual(randomUser.props.email.address);
    await expect(result.customer.uid).toEqual(randomUser.props.uid);
    await expect((result.metadatas as StrongAuthVerifierMetadata).icgAuthInitSession).toBeTruthy();
    await expect((result.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult).toBeTruthy();
    await expect(result.valid).toBeFalsy();
  });

  it('Should throw AUTH_INIT_UNKNOWN_ICG_VALIDATION_METHOD_TYPE when unknown validation type from ICG', async done => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);
    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeaders(redirectPathname))
      .get(redirectPathname)
      .reply(
        200,
        generateAuthInitRedirectResponseUnknownPayload(randomVerifierId),
        generateAuthInitRedirectResponseHeaders(),
      );

    const strongAuthVerifierPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitUnknownIcgValidationMethodType).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('Should throw AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER after 3 OTP SMS without credentials verification', async done => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);
    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeadersWithRedirect(redirectPathname))
      .get(redirectPathname)
      .reply(
        200,
        generateRedirectExceedResponsePayload(randomVerifierId),
        generateAuthInitRedirectResponseFullHeaders(),
      );

    const strongAuthVerifierPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitTooManyAuthSessionsForUser).toBeTruthy();
        const errTooManyAuthSessionsForUser: AuthenticationError.AuthInitTooManyAuthSessionsForUser = err;
        expect(errTooManyAuthSessionsForUser.safeMessage).toMatch(
          sanitizeErrorMessage(DefaultDomainErrorMessages.AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER),
        );
        expect(errTooManyAuthSessionsForUser.cause).toEqual({
          uid: randomUser.props.uid,
          msg: DefaultUiErrorMessages.AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER,
        });
        done();
      },
    });
  });

  it('Should throw AUTH_INIT_UNKNOWN_USER when authenticating with user not provisioned by ICG', async done => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);
    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeadersWithRedirect(redirectPathname))
      .get(redirectPathname)
      .reply(
        200,
        generateRedirectUnknownUserResponsePayload(randomVerifierId),
        generateAuthInitRedirectResponseFullHeaders(),
      );

    const strongAuthVerifierPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitUnknownUser).toBeTruthy();
        done();
      },
    });
  });

  it('Should generate CLOUDCARD verifier with ICG auth init redirection with cookies', async () => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);
    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeaders(redirectPathname))
      .get(redirectPathname)
      .reply(
        200,
        generateAuthInitRedirectResponseCloudcardPayload(randomVerifierId),
        generateAuthInitRedirectResponseHeaders(),
      );

    const result = await dependencies.requestSca.execute({ userId: randomUser.props.uid });

    await expect(result.factor).toMatch(AuthFactor.CLOUDCARD);
    await expect(result.channel).toBeNull();
    await expect(result.status).toMatch(AuthStatus.PENDING);
    await expect(result.customer.email).toMatch(randomUser.props.email.address);
    await expect(result.customer.uid).toMatch(randomUser.props.uid);
    await expect((result.metadatas as StrongAuthVerifierMetadata).icgAuthInitSession).toBeTruthy();
    await expect((result.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult).toBeTruthy();
    await expect(result.valid).toBeFalsy();
  });

  it('Should reject AUTH_INIT_REDIRECT_TO_ERROR_PAGE when ICG auth init redirect with 302 status after 5 attempts', async done => {
    // TODO: fix so that no need for timeout to make test pass (after merge provisioning refacto with event lib - pullrequest/2296)
    // Note: test is functional but needs timeout to pass
    jest.setTimeout(30000);
    const randomUser = await _setupRandomUser(userRepo);

    // redirect with 302 status point to nondescript error page
    nock(icgAuthBaseUrl.href)
      .persist()
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(302);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitRedirectToErrorPage).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('Should reject AUTH_INIT_SAML_REQUEST_FAIL when initial ICG auth init request fails', async done => {
    const randomUser = await _setupRandomUser(userRepo);

    nock(icgAuthBaseUrl.href).get(icgAuthSamlPath).query(generateGenericNockQueryMatcher()).reply(500);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitSamlRequestFail).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('Should reject AUTH_INIT_NO_REDIRECT when ICG auth init no redirection', async done => {
    const randomUser = await _setupRandomUser(userRepo);
    nock(icgAuthBaseUrl.href).get(icgAuthSamlPath).query(generateGenericNockQueryMatcher()).reply(200);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitNoRedirect).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('Should throw AUTH_INIT_FOLLOW_REDIRECT_FAIL when ICG auth init following redirection fails after retries', async done => {
    const { redirectPathname } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeaders(redirectPathname))
      .get(redirectPathname)
      .reply(500);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitFollowRedirectFail).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should not verify an expired SMS verifier', async () => {
    const randomVerifierId = generateRandomId();
    const randomUser = await _setupRandomUser(userRepo);
    const expiredSmsVerifier = generateRandomExpiredSmsVerifierBeforeVerify(
      randomVerifierId,
      randomUser.props.uid,
    );
    await verifierRepo.save(expiredSmsVerifier);

    const command = { verifierId: randomVerifierId, credential: expiredSmsVerifier.credential };
    const result = await dependencies.verifyCredentials.execute(command);

    return expect(result.valid).toBeFalsy();
  });

  it('should not verify an expired CLOUDCARD verifier', async () => {
    const randomVerifierId = generateRandomId();
    const randomUser = await _setupRandomUser(userRepo);
    const expiredCloudcardVerifier = generateRandomExpiredCloudcardVerifierBeforeVerify(
      randomVerifierId,
      randomUser.props.uid,
    );
    await verifierRepo.save(expiredCloudcardVerifier);

    const command = { verifierId: expiredCloudcardVerifier.verifierId };
    const result = await dependencies.verifyCredentials.execute(command);

    await expect(result.valid).toBeFalsy();
  });

  it('should fail OTP SMS verify when no credentials', async () => {
    const randomVerifierId = generateRandomId();
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);

    const command = { verifierId: randomVerifierId };
    const strongAuthVerifierPromise = dependencies.verifyCredentials.execute(command);

    await expect(strongAuthVerifierPromise).rejects.toThrow(AuthenticationError.BadCredentials);
  });

  it('should succeed OTP SMS verify', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, {
        ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
        response: generateAuthVerifySuccessWithSamlResponse(),
      });

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const result = await dependencies.verifyCredentials.execute(command);

    await expect(result).toBeTruthy();
  });

  it('should succeed OTP SMS verify when saml response signature verification feature disabled', async () => {
    const handler = kernel.get<AuthValidationResonseHandler>(
      AuthIdentifier.authValidationResponseHandler,
    ) as IcgAuthValidationResponseHandler;
    const original = handler.toggleResponseSignatureVerification;
    handler.toggleResponseSignatureVerification = false;

    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, {
        ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
        response: generateAuthVerifySuccessWithSamlResponse(),
      });

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const result = await dependencies.verifyCredentials.execute(command);

    await expect(result).toBeTruthy();
    handler.toggleResponseSignatureVerification = original;
  });

  it('should fail OTP SMS verify because unsigned saml response', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, {
        ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
        response: generateAuthVerifySuccessWithUnsignedSamlResponse(),
      });

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const resultPromise = dependencies.verifyCredentials.execute(command);

    await expect(resultPromise).rejects.toThrow(
      AuthenticationError.SecurityAssertionSignatureVerificationFailed,
    );
  });

  it('should fail OTP SMS verify because invalid saml response signature', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, {
        ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
        response: generateAuthVerifySuccessWithSamlResponseWithInvalidSignature(),
      });

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const resultPromise = dependencies.verifyCredentials.execute(command);

    await expect(resultPromise).rejects.toThrow(AuthenticationError.SecurityAssertionInvalidSignature);
  });

  it('should fail OTP SMS verify because unknown auth factor in response', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadataAndUnknownAuthFactor(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, {
        ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
        response: generateAuthVerifySuccessWithSamlResponse(),
      });

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const resultPromise = dependencies.verifyCredentials.execute(command);

    await expect(resultPromise).rejects.toThrow(AuthenticationError.UnknownAuthenticationFactor);
  });

  it('should throw AUTH_VERIFY_MALFORMED_OTP_SMS_RESPONSE_BODY when OTP SMS verify receives malformed response body', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();
    const malformedResponseBody = generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, malformedResponseBody);

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const resultPromise = dependencies.verifyCredentials.execute(command);

    await expect(resultPromise).rejects.toThrow(AuthenticationError.AuthVerifyMalformedResponse);
  });

  it('should succeed CLOUDCARD verify', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupCloudVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchCloudcardAuthRequestPayload)
      .reply(200, {
        ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
        response: generateAuthVerifySuccessWithSamlResponse(),
      });

    const result = await dependencies.verifyCredentials.execute({ verifierId: randomVerifierId });

    await expect(result).toBeTruthy();
  });

  it('should throw AUTH_VERIFY_MALFORMED_CLOUDCARD_RESPONSE_BODY when CLOUDCARD verify receives malformed response body', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupCloudVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const malformedResponseBody = generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchCloudcardAuthRequestPayload)
      .reply(200, malformedResponseBody);

    const resultPromise = dependencies.verifyCredentials.execute({ verifierId: randomVerifierId });

    await expect(resultPromise).rejects.toThrow(AuthenticationError.AuthVerifyMalformedResponse);
  });

  it('should reject AUTH_VERIFY_FAIL when ICG auth verify request fails after retries', async done => {
    // necessary for retrying
    jest.setTimeout(35000);
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href).post(icgAuthVerifyPath, _matchSmsAuthRequestPayload).reply(500);

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const resultPromise = dependencies.verifyCredentials.execute(command);

    from(resultPromise).subscribe({
      error: err => {
        //fixme make an error in nock more explicit.
        expect(err).toBeTruthy();
        done();
      },
      complete: () => {
        done();
      },
    });
  });

  it('should fail OTP SMS verify with wrong OTP less than 3 times', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, generateFailedSmsVerifyResponseLessThan3Times());

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const result = await dependencies.verifyCredentials.execute(command);

    expect(result.valid).toBeFalsy();
  });

  it('should fail OTP SMS verify with wrong OTP more than 3 times', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, generateLockedSmsVerifyResponseAfter3FailedRetriesPayload(randomVerifierId));

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const result = await dependencies.verifyCredentials.execute(command);

    expect(result.valid).toBeFalsy();
  });

  it('should fail OTP SMS verify with wrong OTP more than 7 times (locked ICG user) and 1 failed retry after unlocked', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);
    const randomSmsOtp = generateRandomSmsOtpLenght8();

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, generateLockedSmsVerifyResponseAfter7FailedRetriesPayload(randomVerifierId));

    const command = { verifierId: randomVerifierId, credential: randomSmsOtp };
    const result = await dependencies.verifyCredentials.execute(command);

    expect(result.valid).toBeFalsy();
    expect(result.metadatas['icgAuthInitResult']['unblockingDate']).toBeTruthy();
  });

  it('should throw AUTH_INIT_AUTHENTICATION_LOCKED exception with unblocking date when attempt to signing while ICG user locked', async () => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);
    const blockedVerifier = generateRandomBlockedSmsVerifier(randomVerifierId, randomUser.props.uid);
    await verifierRepo.save(blockedVerifier);

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeaders(redirectPathname))
      .get(redirectPathname)
      .reply(200, generateLockedAuthRedirectResponseWhileUserLockedPayload(randomVerifierId), {
        'set-cookie': [],
      });

    const resultPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    await expect(resultPromise).rejects.toThrow(AuthenticationError.AuthInitAuthenticationLocked);
  });

  it('should throw BLOCKED_VERIFIER_NOT_FOUND exception when attempt to signing while ICG user locked but no locked verifier found', async () => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);
    await _setupRandomSmsVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeaders(redirectPathname))
      .get(redirectPathname)
      .reply(200, generateLockedAuthRedirectResponseWhileUserLockedPayload(randomVerifierId), {
        'set-cookie': [],
      });

    const resultPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    await expect(resultPromise).rejects.toThrow(AuthenticationError.VerifierNotFound);
  });

  it('should throw AUTH_INIT_AUTHENTICATION_FAILED_SMS_PROVIDER_ERROR when ICG SMS provider error', async () => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeaders(redirectPathname))
      .get(redirectPathname)
      .reply(200, generateSmsProviderErrorRedirectResponsePayload(randomVerifierId), {
        'set-cookie': [],
      });

    const resultPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    await expect(resultPromise).rejects.toThrow(
      AuthenticationError.AuthInitAuthenticationFailedSmsProviderError,
    );
  });

  it('should throw AUTH_INIT_AUTHENTICATION_FAILED when ICG auth init error', async () => {
    const { redirectPathname, randomVerifierId } = _setupRandomAuthInitRedirectPath();
    const randomUser = await _setupRandomUser(userRepo);

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query(generateGenericNockQueryMatcher())
      .reply(303, {}, generateSamlAuthInitResponseHeaders(redirectPathname))
      .get(redirectPathname)
      .reply(200, generateGenericFailedAuthRedirectResponsePayload(randomVerifierId), {
        'set-cookie': [],
      });

    const resultPromise = dependencies.requestSca.execute({ userId: randomUser.props.uid });

    await expect(resultPromise).rejects.toThrow(AuthenticationError.AuthInitAuthenticationFailed);
  });

  it('should fail CLOUDCARD verify with wrong less than 3 times', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupCloudVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchCloudcardAuthRequestPayload)
      .reply(200, generateFailedCloudcardVerifyResponseLessThan3TimesPayload());

    const result = await dependencies.verifyCredentials.execute({ verifierId: randomVerifierId });

    expect(result.valid).toBeFalsy();
    expect(result.status).toEqual(AuthStatus.PENDING);
  });

  it('should fail CLOUDCARD verify with clearance rejected', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupCloudVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchCloudcardAuthRequestPayload)
      .reply(200, generateCloudcardVerifyClearanceRejectedResponsePayload(randomVerifierId));

    const result = await dependencies.verifyCredentials.execute({ verifierId: randomVerifierId });

    expect(result.valid).toBeFalsy();
    expect(result.status).toEqual(AuthStatus.FAILED);
  });

  it('should fail CLOUDCARD verify with wrong PIN more than 3 times', async () => {
    const { randomVerifierId, icgAuthVerifyPath } = _setupRandomVerifyPath(icgVerifyPath);
    const randomUser = await _setupRandomUser(userRepo);
    await _setupCloudVerifierWithMetadata(randomVerifierId, randomUser, verifierRepo);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchCloudcardAuthRequestPayload)
      .reply(200, generateLockedCloudcardVerifyResponseAfter3FailedRetriesPayload(randomVerifierId));

    const result = await dependencies.verifyCredentials.execute({ verifierId: randomVerifierId });

    expect(result.valid).toBeFalsy();
    expect(result.status).toEqual(AuthStatus.FAILED);
  });

  it('should throw a VERIFIER_NOT_FOUND error when SMS verifiernot found', async () => {
    const command = { verifierId: 'notexist', credential: 'azeazezae' };
    const resultPromise = dependencies.verifyCredentials.execute(command);

    await expect(resultPromise).rejects.toThrow(AuthenticationError.VerifierNotFound);
  });

  afterAll(async done => {
    nock.cleanAll();
    done();
  });
});
