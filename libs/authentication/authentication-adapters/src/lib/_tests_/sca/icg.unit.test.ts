/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  AuthenticationError,
  AuthFactor,
  AuthStatus,
  Channel,
  DefaultDomainErrorMessages,
  DefaultUiErrorMessages,
  DomainDependencies,
  Email,
  sanitizeErrorMessage,
  StrongAuthVerifier,
  User,
  UserRepository,
  VerifierRepository,
  OtpSmsAuthMethod,
  Invitation,
} from '@oney/authentication-core';
import * as nock from 'nock';
import { from } from 'rxjs';
import { RestrictedVerifierMapper } from '../../adapters/mappers/RestrictedVerifierMapper';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';
import { testConfiguration } from '../fixtures/config/config';
import { StrongAuthVerifierMetadata } from '../../adapters/types/icg/StrongAuthVerifierMetadata';
import {
  generateAuthInitRedirectResponsePayloadContextPart,
  generateAuthVerifySuccessWithSamlResponse,
  generateAuthVerifySuccessWithUnsignedSamlResponse,
  generateRandomSmsOtpLenght8,
  _matchCloudcardAuthRequestPayload,
  _matchSmsAuthRequestPayload,
  _setupRandomSmsVerifierWithMetadata,
  _setupRandomUser,
  _setupRandomVerifyPath,
} from '../fixtures/icgrefauth/scaFactories';
import { initializeInMemoryAuthenticationBuildDependencies } from '../fixtures/initializeInMemoryAuthenticationBuildDependencies';

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

describe('StrongCustomerAuthentication usecases integration testing', () => {
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
  let smsUserId: string;
  let smsUserEmail: Email;
  let smsVerifierId: string;
  let cloudcardUserId: string;
  let cloudcardUserEmail: Email;
  let cloudcardVerifierId: string;
  let verifierRepo: VerifierRepository;
  let kernel: AuthenticationBuildDependencies;
  let dependencies: DomainDependencies;
  let userMap: Map<string, User>;
  let otpSms: string;

  beforeAll(async () => {
    // await SecretService.loadSecrets();
    odbCertConfig = {
      odbSignCert64: testConfiguration.secretService.odbSignCert,
      odbSignCertPass: testConfiguration.secretService.odbSignCertPass,
    };
    icgAuthBaseUrl = new URL(icgBaseUrl);
    odbSignCert64 = odbCertConfig.odbSignCert64;
    odbSignCertPass = odbCertConfig.odbSignCertPass;
    smsUserId = '547';
    smsUserEmail = Email.from('smsuser@mail.com');
    cloudcardUserId = '65438';
    cloudcardUserEmail = Email.from('cloudcarduser@mail.com');
    const verifierMap = new Map<string, StrongAuthVerifier>();
    const invitationMap = new Map<string, Invitation>();
    userMap = new Map<string, User>();

    userMap.set(
      smsUserId,
      new User({
        uid: smsUserId,
        pinCode: null,
        email: smsUserEmail,
        phone: '0612345678',
      }),
    );
    userMap.set(
      cloudcardUserId,
      new User({
        uid: cloudcardUserId,
        pinCode: null,
        email: cloudcardUserEmail,
        phone: '0612345678',
      }),
    );

    kernel = (
      await initializeInMemoryAuthenticationBuildDependencies({ userMap, verifierMap, invitationMap })
    ).kernel;

    dependencies = kernel.getDependencies();

    verifierRepo = dependencies.verifierRepository;
    userRepo = dependencies.userRepository;

    // make this test suite use icg verifier gateway

    otpSms = '12345';
  });

  beforeEach(async () => {
    nock.cleanAll.bind(nock);
    nock.cleanAll();
  });

  it('should get ICG configuration environment variables and ODB signing certificate secrets', async () => {
    const icgConf = testConfiguration.icgConfig;
    expect(icgConf.icgApplication).toBeTruthy();
    expect(icgConf.icgContextId).toBeTruthy();
    expect(icgConf.icgBaseUrl).toBeTruthy();
    expect(icgConf.icgSamlPath).toBeTruthy();
    expect(icgConf.icgVerifyPath).toBeTruthy();
    expect(icgConf.odbSigAlgUrl).toBeTruthy();
    expect(odbSignCert64).toBeTruthy();
    expect(odbSignCertPass).toBeTruthy();
  });

  it('Should generate SMS verifier with ICG auth init redirection with cookies', async () => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722';
    smsVerifierId = 'CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722_OTP_SMS';
    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          location: redirectPathname,
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
        },
      )
      .get(redirectPathname)
      .reply(
        200,
        {
          id: smsVerifierId,
          locale: 'en',
          context: {
            CTX_ONEY_BANKING: {
              SENDER_NAME: '12869',
              texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
              NOTIF_DESC: 'Demande authentification',
              SEND_NOTIF: 'true',
              NOTIF_TITLE: 'Opération sensible',
              DESC: "Demande d'ajout de bénéficiaire externe : MrXX",
            },
          },
          step: {
            phase: {
              state: 'AUTHENTICATION',
              retryCounter: 3,
              fallbackFactorAvailable: false,
              securityLevel: '202',
            },
            validationUnits: [
              {
                '45ea4718-fed0-4a98-9daa-82949e8869ad': [
                  {
                    type: 'SMS',
                    id: 'c8fa7fce-0820-4855-8571-c3be11b41e6f',
                    maxSize: 8,
                    minSize: 8,
                    phoneNumber: '06XXXXXX17',
                  },
                ],
              },
            ],
          },
        },
        {
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
            'JSESSIONID=fLIhn6TPNwFcpNmhZwNCJyu14tiI8a-H_iI-FYqh.uq0mt052; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4152555134.59233.0000; expires=Thu, 06-Aug-2020 19:40:59 GMT; path=/; Httponly;Secure',
          ],
        },
      );

    const result = await dependencies.requestSca.execute({
      userId: smsUserId,
    });
    expect(result.factor).toMatch(AuthFactor.OTP);
    expect(result.channel).toMatch(Channel.SMS);
    expect(result.status).toMatch(AuthStatus.PENDING);
    expect(result.customer.email).toEqual(smsUserEmail.address);
    expect(result.customer.uid).toEqual(smsUserId);
    expect((result.metadatas as StrongAuthVerifierMetadata).icgAuthInitSession).toBeTruthy();
    expect((result.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult).toBeTruthy();
    expect(result.valid).toBeFalsy();
  });

  it('Should throw AUTH_INIT_UNKNOWN_ICG_VALIDATION_METHOD_TYPE when unknown validation type from ICG', async done => {
    const unkonownTypeVerifierId = 'CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722_UNKNOWN_TYPE';
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722';

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          location: redirectPathname,
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
          ],
        },
      )
      .get(redirectPathname)
      .reply(
        200,
        {
          id: unkonownTypeVerifierId,
          locale: 'en',
          context: {
            CTX_ONEY_BANKING: {
              SENDER_NAME: '12869',
              texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
              NOTIF_DESC: 'Demande authentification',
              SEND_NOTIF: 'true',
              NOTIF_TITLE: 'Opération sensible',
              DESC: "Demande d'ajout de bénéficiaire externe : MrXX",
            },
          },
          step: {
            phase: {
              state: 'AUTHENTICATION',
              retryCounter: 3,
              fallbackFactorAvailable: false,
              securityLevel: '202',
            },
            validationUnits: [
              {
                '45ea4718-fed0-4a98-9daa-82949e8869ad': [
                  {
                    type: 'UNKNOWN_TYPE_FROM_ICG',
                    id: 'c8fa7fce-0820-4855-8571-c3be11b41e6f',
                    maxSize: 8,
                    minSize: 8,
                    phoneNumber: '06XXXXXX17',
                  },
                ],
              },
            ],
          },
        },
        {
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
            'JSESSIONID=fLIhn6TPNwFcpNmhZwNCJyu14tiI8a-H_iI-FYqh.uq0mt052; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4152555134.59233.0000; expires=Thu, 06-Aug-2020 19:40:59 GMT; path=/; Httponly;Secure',
          ],
        },
      );

    // Given
    const unkonownTypeUserId = 'unkonownTypeUserId';
    const user = new User({
      uid: unkonownTypeUserId,
      pinCode: null,
      email: Email.from('dsdsd@df.fr'),
      phone: '0612345678',
    });

    await userRepo.save(user);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({
      userId: unkonownTypeUserId,
    });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitUnknownIcgValidationMethodType).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('Should throw AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER after 3 OTP SMS without credentials verification', async done => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522';
    const followRedirectExceedResponseBody = {
      id: 'CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522',
      locale: 'en',
      context: {
        CTX_ONEY_BANKING: {
          SENDER_NAME: '12869',
          texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
          NOTIF_DESC: 'Demande authentification',
          SEND_NOTIF: 'true',
          NOTIF_TITLE: 'Opération sensible',
          DESC: "Demande d'ajout de bénéficiaire externe : Mr X",
        },
      },
      response: {
        status: 'AUTHENTICATION_FAILED',
        saml2_post: {
          samlResponse:
            'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpwcm90b2Nvb' +
            'CIgRGVzdGluYXRpb249InVybF9hcHBlbGFudCIgSUQ9IkN0eERBQ1NMUTMxYWQ1M2E1ODA2OTM0YTU3ODI3MzdlZDBiYTRkODNkNT' +
            'IyIiBJblJlc3BvbnNlVG89Il84Y2QzOWI2Mi1mYzUzLTQ5MjEtOThmNS1hMjk1MWEwNDVjNzEiIElzc3VlSW5zdGFudD0iMjAyMC0' +
            'wOC0xMlQxOTo0NzoyNy40MjBaIiBWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1l' +
            'czp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVybjpkaWN0YW86ZGFjczwvc2FtbDI6SXNzdWVyPjxzYW1sMnA6U3RhdHVzPjxzYW1sM' +
            'nA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMn' +
            'A6U3RhdHVzQ29kZT48c2FtbDJwOlN0YXR1c01lc3NhZ2U+RXhjZWVkZWQ8L3NhbWwycDpTdGF0dXNNZXNzYWdlPjwvc2FtbDJwOlN' +
            '0YXR1cz48L3NhbWwycDpSZXNwb25zZT4=',
          action: 'url_appelant',
          method: 'POST',
        },
      },
    };

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          date: 'Wed, 12 Aug 2020 19:47:27 GMT',
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp826afd2b88b84dddaabf35d6c4bf9d99; path=/; secure; HttpOnly; SameSite=None',
            'JSESSIONID=RgCb6jc_3e6EEPszJlan7Ksl4rp18nSNuURadKZA.uq0mt051; path=/dacswebssoissuer; HttpOnly; Secure; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Wed, 12-Aug-2020 20:07:27 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
          'strict-transport-security': 'max-age=300; includeSubDomains; preload',
          'x-content-type-options': 'nosniff',
          'content-security-policy':
            "default-src *.tls.icgauth.qpa.caisse-epargne.fr 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src *.xiti.com 'self';",
          'x-xss-protection': '1; mode=block',
          p3p: 'CP="IDC ADM DEV TAI PSA PSD IVA IVD CON HIS OUR IND CNT"',
          location: '/dacsrest/api/v1u0/transaction/CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522',
          'content-length': '0',
          'content-type': 'text/plain',
          connection: 'close',
        },
      )
      .get(redirectPathname)
      .reply(200, followRedirectExceedResponseBody, {
        date: 'Wed, 12 Aug 2020 19:47:27 GMT',
        'set-cookie': [
          'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
          'JSESSIONID=lqMWMUWM7sBZPD4KhZ9aFddcxPTSkGzYVARB6TJI.uq0mt051; path=/; secure; HttpOnly; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; SameSite=None',
          'ICG=4135777918.59233.0000; expires=Wed, 12-Aug-2020 20:07:27 GMT; path=/; Httponly;Secure',
        ],
        'strict-transport-security': 'max-age=300; includeSubDomains; preload',
        'x-content-type-options': 'nosniff',
        'content-security-policy':
          "default-src *.tls.icgauth.qpa.caisse-epargne.fr 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src *.xiti.com 'self';",
        'x-xss-protection': '1; mode=block',
        expires: '0',
        'cache-control': 'no-cache, must-revalidate, no-transform, no-store, max-age=0',
        pragma: 'no-cache',
        'content-type': 'application/json',
        connection: 'close',
      });

    const strongAuthVerifierPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitTooManyAuthSessionsForUser).toBeTruthy();

        const errTooManyAuthSessionsForUser = err as AuthenticationError.AuthInitTooManyAuthSessionsForUser;
        expect(errTooManyAuthSessionsForUser.safeMessage).toMatch(
          sanitizeErrorMessage(DefaultDomainErrorMessages.AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER),
        );
        expect(errTooManyAuthSessionsForUser.cause).toEqual({
          uid: smsUserId,
          msg: DefaultUiErrorMessages.AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER,
        });
        done();
      },
    });
  });

  it('Should throw AUTH_INIT_UNKNOWN_USER when authenticating with user not provisioned by ICG', async done => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522';
    const followRedirectUnknownUserResponseBody = {
      id: 'CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522',
      locale: 'en',
      context: {
        CTX_ONEY_BANKING: {
          SENDER_NAME: '12869',
          texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
          NOTIF_DESC: 'Demande authentification',
          SEND_NOTIF: 'true',
          NOTIF_TITLE: 'Opération sensible',
          DESC: "Demande d'ajout de bénéficiaire externe : Mr X",
        },
      },
      response: {
        status: 'AUTHENTICATION_FAILED',
        saml2_post: {
          samlResponse:
            'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpwcm90b2NvbCIgRGVz' +
            'dGluYXRpb249InVybF9hcHBlbGFudCIgSUQ9IkN0eERBQ1NMUTRmMWNiYzczMWYzODk0MDBlOWJkOTc3ODM1MDJkODZjODIyIiBJblJlc3BvbnN' +
            'lVG89Il9mZWQwZDE1Zi03YjZiLTQ2NzctOTI5NC1kODJiYWQ3YjNkODkiIElzc3VlSW5zdGFudD0iMjAyMC0wOC0yOFQyMToyMzozOC40MTBaIiBWZ' +
            'XJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVybjpkaWN' +
            '0YW86ZGFjczwvc2FtbDI6SXNzdWVyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw' +
            '6Mi4wOnN0YXR1czpVbmtub3duUHJpbmNpcGFsIj48L3NhbWwycDpTdGF0dXNDb2RlPjwvc2FtbDJwOlN0YXR1cz48L3NhbWwycDpSZXNwb25zZT4=',
          action: 'url_appelant',
          method: 'POST',
        },
      },
    };

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          date: 'Wed, 12 Aug 2020 19:47:27 GMT',
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp826afd2b88b84dddaabf35d6c4bf9d99; path=/; secure; HttpOnly; SameSite=None',
            'JSESSIONID=RgCb6jc_3e6EEPszJlan7Ksl4rp18nSNuURadKZA.uq0mt051; path=/dacswebssoissuer; HttpOnly; Secure; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Wed, 12-Aug-2020 20:07:27 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
          'strict-transport-security': 'max-age=300; includeSubDomains; preload',
          'x-content-type-options': 'nosniff',
          'content-security-policy':
            "default-src *.tls.icgauth.qpa.caisse-epargne.fr 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src *.xiti.com 'self';",
          'x-xss-protection': '1; mode=block',
          p3p: 'CP="IDC ADM DEV TAI PSA PSD IVA IVD CON HIS OUR IND CNT"',
          location: '/dacsrest/api/v1u0/transaction/CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522',
          'content-length': '0',
          'content-type': 'text/plain',
          connection: 'close',
        },
      )
      .get(redirectPathname)
      .reply(200, followRedirectUnknownUserResponseBody, {
        date: 'Wed, 12 Aug 2020 19:47:27 GMT',
        'set-cookie': [
          'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
          'JSESSIONID=lqMWMUWM7sBZPD4KhZ9aFddcxPTSkGzYVARB6TJI.uq0mt051; path=/; secure; HttpOnly; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; SameSite=None',
          'ICG=4135777918.59233.0000; expires=Wed, 12-Aug-2020 20:07:27 GMT; path=/; Httponly;Secure',
        ],
        'strict-transport-security': 'max-age=300; includeSubDomains; preload',
        'x-content-type-options': 'nosniff',
        'content-security-policy':
          "default-src *.tls.icgauth.qpa.caisse-epargne.fr 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src *.xiti.com 'self';",
        'x-xss-protection': '1; mode=block',
        expires: '0',
        'cache-control': 'no-cache, must-revalidate, no-transform, no-store, max-age=0',
        pragma: 'no-cache',
        'content-type': 'application/json',
        connection: 'close',
      });

    const strongAuthVerifierPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitUnknownUser).toBeTruthy();
        done();
      },
    });
  });

  it('Should generate CLOUDCARD verifier with ICG auth init redirection with cookies', async () => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf723';
    cloudcardVerifierId = 'CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722_CLOUDCARD';

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          location: redirectPathname,
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
        },
      )
      .get(redirectPathname)
      .reply(
        200,
        {
          id: cloudcardVerifierId,
          locale: 'en',
          context: {
            CTX_ONEY_BANKING: {
              SENDER_NAME: '12869',
              texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
              NOTIF_DESC: 'Demande authentification',
              SEND_NOTIF: 'true',
              NOTIF_TITLE: 'Opération sensible',
              DESC: "Demande d'ajout de bénéficiaire externe : MrXX",
            },
          },
          step: {
            phase: {
              state: 'AUTHENTICATION',
              retryCounter: 3,
              fallbackFactorAvailable: false,
              securityLevel: '202',
            },
            validationUnits: [
              {
                '64c87611-5a2f-4028-ada5-c77ea8509e45': [
                  {
                    type: 'CLOUDCARD',
                    id: '77fb1d12-a302-49bb-b372-1d3e04199372',
                    asynchronousWaitingTime: 2000,
                    cloudCardRequestId: '879f4bfb-7b69-4886-8ec3-1a2e892f8f84',
                    requestTimeToLive: 420,
                  },
                ],
              },
            ],
          },
        },
        {
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
            'JSESSIONID=fLIhn6TPNwFcpNmhZwNCJyu14tiI8a-H_iI-FYqh.uq0mt052; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4152555134.59233.0000; expires=Thu, 06-Aug-2020 19:40:59 GMT; path=/; Httponly;Secure',
          ],
        },
      );

    const result = await dependencies.requestSca.execute({
      userId: cloudcardUserId,
    });

    expect(result.factor).toMatch(AuthFactor.CLOUDCARD);
    expect(result.channel).toBeNull();
    expect(result.status).toMatch(AuthStatus.PENDING);
    expect(result.customer.email).toMatch(cloudcardUserEmail.address);
    expect(result.customer.uid).toMatch(cloudcardUserId);
    expect((result.metadatas as StrongAuthVerifierMetadata).icgAuthInitSession).toBeTruthy();
    expect((result.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult).toBeTruthy();
    expect(result.valid).toBeFalsy();
  });

  // redirect with 302 status point to nondescript error page
  it('Should reject AUTH_INIT_REDIRECT_TO_ERROR_PAGE when ICG auth init redirect with 302 status after 5 attempts', async done => {
    jest.setTimeout(35000);

    nock(icgAuthBaseUrl.href)
      .persist()
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(302);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitRedirectToErrorPage).toBeTruthy();
        done();
      },
    });
  });

  it('Should reject AUTH_INIT_SAML_REQUEST_FAIL when initial ICG auth init request fails', async done => {
    jest.setTimeout(35000);

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(500);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitSamlRequestFail).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('Should reject AUTH_INIT_NO_REDIRECT when ICG auth init no redirection', async done => {
    jest.setTimeout(35000);

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(200);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitNoRedirect).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('Should throw AUTH_INIT_FOLLOW_REDIRECT_FAIL when ICG auth init following redirection fails after retries', async done => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722';

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          location: redirectPathname,
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
        },
      )
      .get(redirectPathname)
      .reply(500);

    const strongAuthVerifierPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });

    from(strongAuthVerifierPromise).subscribe({
      error: err => {
        expect(err instanceof AuthenticationError.AuthInitFollowRedirectFail).toBeTruthy();
        done();
      },
      complete: () => done(),
    });
  });

  it('should not verify an expired SMS verifier', async () => {
    verifierRepo.save(
      new StrongAuthVerifier({
        verifierId: 'smsVerifierExpiredId',
        factor: AuthFactor.OTP,
        expirationDate: new Date('02-05-2020'),
        valid: false,
        status: AuthStatus.PENDING,
        credential: 'azeazezae',
        channel: Channel.SMS,
        customer: {
          email: 'toto@toto.com',
          uid: 'userId',
        },
      }),
    );

    const result = await dependencies.verifyCredentials.execute({
      verifierId: 'smsVerifierExpiredId',
      credential: 'azeazezae',
    });

    expect(result.valid).toBeFalsy();
  });

  it('should not verify an expired CLOUDCARD verifier', async () => {
    verifierRepo.save(
      new StrongAuthVerifier({
        verifierId: 'cloudcardVerifierExpiredId',
        factor: AuthFactor.CLOUDCARD,
        expirationDate: new Date('02-05-2020'),
        valid: false,
        status: AuthStatus.PENDING,
        credential: 'azeazezae',
        channel: null,
        customer: {
          email: 'toto@toto.com',
          uid: 'userId',
        },
      }),
    );

    const result = await dependencies.verifyCredentials.execute({
      verifierId: 'cloudcardVerifierExpiredId',
      credential: 'azeazezae',
    });

    expect(result.valid).toBeFalsy();
  });

  it('should fail OTP SMS verify when no credentials', async () => {
    const strongAuthVerifierPromise = dependencies.verifyCredentials.execute({
      verifierId: smsVerifierId,
    });

    await expect(strongAuthVerifierPromise).rejects.toThrow(AuthenticationError.BadCredentials);
  });

  it('should succeed OTP SMS verify', async () => {
    const icgAuthVerifyPath = icgVerifyPath.replace('$verifierId', smsVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, {
        id: smsVerifierId,
        locale: 'en',
        context: {
          CTX_ONEY_BANKING: {
            SENDER_NAME: '12869',
            texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
            NOTIF_DESC: 'Demande authentification',
            SEND_NOTIF: 'true',
            NOTIF_TITLE: 'Opération sensible',
            DESC: "Demande d'ajout de bénéficiaire externe : Mr BERLON Philippe",
          },
        },
        response: {
          status: 'AUTHENTICATION_SUCCESS',
        },
      });

    const result = await dependencies.verifyCredentials.execute({
      verifierId: smsVerifierId,
      credential: otpSms,
    });

    expect(result).toBeTruthy();
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

  it('should throw AUTH_VERIFY_MALFORMED_OTP_SMS_RESPONSE_BODY when OTP SMS verify receives malformed response body', async () => {
    const icgAuthVerifyPath = icgVerifyPath.replace('$verifierId', smsVerifierId);

    const malformedResponseBody = {
      id: smsVerifierId,
      locale: 'en',
      context: {
        CTX_ONEY_BANKING: {
          SENDER_NAME: '12869',
          texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
          NOTIF_DESC: 'Demande authentification',
          SEND_NOTIF: 'true',
          NOTIF_TITLE: 'Opération sensible',
          DESC: "Demande d'ajout de bénéficiaire externe : Mr BERLON Philippe",
        },
      },
    };

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, malformedResponseBody);

    const resultPromise = dependencies.verifyCredentials.execute({
      verifierId: smsVerifierId,
      credential: otpSms,
    });

    await expect(resultPromise).rejects.toThrow(AuthenticationError.AuthVerifyMalformedResponse);
  });

  it('should succeed CLOUDCARD verify', async () => {
    const icgAuthVerifyPath = icgVerifyPath.replace('$verifierId', cloudcardVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchCloudcardAuthRequestPayload)
      .reply(200, {
        id: cloudcardVerifierId,
        locale: 'en',
        context: {
          CTX_ONEY_BANKING: {
            SENDER_NAME: '12869',
            texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
            NOTIF_DESC: 'Demande authentification',
            SEND_NOTIF: 'true',
            NOTIF_TITLE: 'Opération sensible',
            DESC: "Demande d'ajout de bénéficiaire externe : Mr BERLON Philippe",
          },
        },
        response: generateAuthVerifySuccessWithSamlResponse(),
      });

    const result = await dependencies.verifyCredentials.execute({
      verifierId: cloudcardVerifierId,
    });

    expect(result).toBeTruthy();
  });

  it('should throw AUTH_VERIFY_MALFORMED_CLOUDCARD_RESPONSE_BODY when CLOUDCARD verify receives malformed response body', async () => {
    const icgAuthVerifyPath = icgVerifyPath.replace('$verifierId', cloudcardVerifierId);

    const malformedResponseBody = {
      id: cloudcardVerifierId,
      locale: 'en',
      context: {
        CTX_ONEY_BANKING: {
          SENDER_NAME: '12869',
          texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
          NOTIF_DESC: 'Demande authentification',
          SEND_NOTIF: 'true',
          NOTIF_TITLE: 'Opération sensible',
          DESC: "Demande d'ajout de bénéficiaire externe : Mr BERLON Philippe",
        },
      },
    };

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchCloudcardAuthRequestPayload)
      .reply(200, malformedResponseBody);

    const resultPromise = dependencies.verifyCredentials.execute({
      verifierId: cloudcardVerifierId,
    });

    await expect(resultPromise).rejects.toThrow(AuthenticationError.AuthVerifyMalformedResponse);
  });

  it('should reject AUTH_VERIFY_FAIL when ICG auth verify request fails after retries', async done => {
    const icgAuthVerifyPath = icgVerifyPath.replace('$verifierId', smsVerifierId);
    nock(icgAuthBaseUrl.href).post(icgAuthVerifyPath, _matchSmsAuthRequestPayload).reply(500);

    const resultPromise = dependencies.verifyCredentials.execute({
      verifierId: smsVerifierId,
      credential: otpSms,
    });

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
    const icgAuthVerifyPath = icgVerifyPath.replace('$verifierId', smsVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchSmsAuthRequestPayload)
      .reply(200, {
        phase: {
          state: 'AUTHENTICATION',
          retryCounter: 2,
          fallbackFactorAvailable: false,
          previousResult: 'FAILED_AUTHENTICATION',
          securityLevel: '202',
          notifications: ['otp_sms_invalid'],
        },
        validationUnits: [
          {
            '45ea4718-fed0-4a98-9daa-82949e8869ad': [
              {
                type: 'SMS',
                id: 'c8fa7fce-0820-4855-8571-c3be11b41e6f',
                maxSize: 8,
                minSize: 8,
                phoneNumber: '06XXXXXX82',
              },
            ],
          },
        ],
      });

    const result = await dependencies.verifyCredentials.execute({
      verifierId: smsVerifierId,
      credential: otpSms,
    });

    expect(result.valid).toBeFalsy();
  });

  it('should fail OTP SMS verify with wrong OTP more than 3 times', async () => {
    const icgAuthVerifyPathSms = icgVerifyPath.replace('$verifierId', smsVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPathSms, _matchSmsAuthRequestPayload)
      .reply(200, {
        id: 'CtxDACSVFOef17fbda22484864971a16a25a1e285522',
        locale: 'en',
        context: {
          CTX_ONEY_BANKING: {
            SENDER_NAME: '12869',
            texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
            NOTIF_DESC: 'Demande authentification',
            SEND_NOTIF: 'true',
            NOTIF_TITLE: 'Opération sensible',
            DESC: "Demande d'ajout de bénéficiaire externe : Mr BERLON Philippe",
          },
        },
        response: {
          status: 'AUTHENTICATION_LOCKED',
          notifications: ['otp_sms_invalid'],
          saml2_post: {
            samlResponse:
              'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMD' +
              'pwcm90b2NvbCIgRGVzdGluYXRpb249Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZXN1bHRhdCIgSUQ9' +
              'IkN0eERBQ1NWRk9lZjE3ZmJkYTIyNDg0ODY0OTcxYTE2YTI1YTFlMjg1NTIyIiBJblJlc3BvbnNlVG89I' +
              'l8zZTNiYjdiNC1jMTgyLTQ4ZjYtOTZjNi0yMTIwNjMxMmRmZDkiIElzc3VlSW5zdGFudD0iMjAyMC0wNi0' +
              'xMFQxMDo1MDo0MC42NzhaIiBWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybj' +
              'pvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVybjpkaWN0YW86ZGFjczwvc2FtbDI6SXNzdW' +
              'VyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBT' +
              'Uw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMnA6U3RhdHVzQ29kZT48c2FtbDJwOlN0YXR1c01lc3NhZ' +
              '2U+TG9ja2VkPC9zYW1sMnA6U3RhdHVzTWVzc2FnZT48L3NhbWwycDpTdGF0dXM+PC9zYW1sMnA6UmVzcG9uc2U+',
            action: 'http://localhost:8080/resultat',
            method: 'POST',
          },
        },
      });

    const result = await dependencies.verifyCredentials.execute({
      verifierId: smsVerifierId,
      credential: otpSms,
    });

    expect(result.valid).toBeFalsy();
  });

  it('should fail OTP SMS verify with wrong OTP more than 7 times (locked ICG user) and 1 failed retry after unlocked', async () => {
    const icgAuthVerifyPathSms = icgVerifyPath.replace('$verifierId', smsVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPathSms, _matchSmsAuthRequestPayload)
      .reply(200, {
        id: 'CtxDACSVFOef17fbda22484864971a16a25a1e285522',
        locale: 'en',
        context: {
          CTX_ONEY_BANKING: {
            SENDER_NAME: '12869',
            texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
            NOTIF_DESC: 'Demande authentification',
            SEND_NOTIF: 'true',
            NOTIF_TITLE: 'Opération sensible',
            DESC: "Demande d'ajout de bénéficiaire externe : Mr BERLON Philippe",
          },
        },
        response: {
          status: 'AUTHENTICATION_LOCKED',
          unlockingDate: '2020-09-30T15:36:13Z',
          notifications: ['otp_sms_invalid'],
          saml2_post: {
            samlResponse:
              'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMD' +
              'pwcm90b2NvbCIgRGVzdGluYXRpb249Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZXN1bHRhdCIgSUQ9' +
              'IkN0eERBQ1NWRk9lZjE3ZmJkYTIyNDg0ODY0OTcxYTE2YTI1YTFlMjg1NTIyIiBJblJlc3BvbnNlVG89I' +
              'l8zZTNiYjdiNC1jMTgyLTQ4ZjYtOTZjNi0yMTIwNjMxMmRmZDkiIElzc3VlSW5zdGFudD0iMjAyMC0wNi0' +
              'xMFQxMDo1MDo0MC42NzhaIiBWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybj' +
              'pvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVybjpkaWN0YW86ZGFjczwvc2FtbDI6SXNzdW' +
              'VyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBT' +
              'Uw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMnA6U3RhdHVzQ29kZT48c2FtbDJwOlN0YXR1c01lc3NhZ' +
              '2U+TG9ja2VkPC9zYW1sMnA6U3RhdHVzTWVzc2FnZT48L3NhbWwycDpTdGF0dXM+PC9zYW1sMnA6UmVzcG9uc2U+',
            action: 'http://localhost:8080/resultat',
            method: 'POST',
          },
        },
      });

    const result = await dependencies.verifyCredentials.execute({
      verifierId: smsVerifierId,
      credential: otpSms,
    });

    expect(result.valid).toBeFalsy();
    expect(result.metadatas['icgAuthInitResult']['unblockingDate']).toBeTruthy();
  });

  it('should throw AUTH_INIT_AUTHENTICATION_LOCKED exception with unblocking date when attempt to signing while ICG user locked', async () => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722';

    const authInitAuthenticationLockedResponse = {
      id: smsVerifierId,
      locale: 'en',
      context: {
        CTX_ONEY_BANKING: {
          SENDER_NAME: '12869',
          texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
          NOTIF_DESC: 'Demande authentification',
          SEND_NOTIF: 'true',
          NOTIF_TITLE: 'Opération sensible',
          DESC: "Demande d'ajout de bénéficiaire externe : MrXX",
        },
      },
      response: {
        status: 'AUTHENTICATION_LOCKED',
        saml2_post: {
          samlResponse:
            'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIu' +
            'MDpwcm90b2NvbCIgRGVzdGluYXRpb249InVybF9hcHBlbGFudCIgSUQ9IkN0eERBQ1NWRk8wMDFlNTJkNmZmNTc0' +
            'NDVkOWM3M2FhZmNjMzk2ZWJjMjIyIiBJblJlc3BvbnNlVG89Il8yMzI0NDI5MC1kNTAwLTRlYmEtOTBiNC1hODI5' +
            'N2QxZjJkNzUiIElzc3VlSW5zdGFudD0iMjAyMC0wOS0zMFQxOToxODoxNS42ODhaIiBWZXJzaW9uPSIyLjAiPjxz' +
            'YW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVyb' +
            'jpkaWN0YW86ZGFjczwvc2FtbDI6SXNzdWVyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT' +
            '0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMnA6U3RhdHVzQ29' +
            'kZT48c2FtbDJwOlN0YXR1c01lc3NhZ2U+TG9ja2VkPC9zYW1sMnA6U3RhdHVzTWVzc2FnZT48L3NhbWwycDpTdGF0' +
            'dXM+PC9zYW1sMnA6UmVzcG9uc2U+',
          action: 'url_appelant',
          method: 'POST',
        },
      },
    };

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          location: redirectPathname,
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
        },
      )
      .get(redirectPathname)
      .reply(200, authInitAuthenticationLockedResponse, {
        'set-cookie': [],
      });

    let blockedVerifier = new StrongAuthVerifier<{ icgAuthInitResult: { unblockingDate: Date } }>({
      verifierId: 'CtxDACStiti',
      metadatas: {
        icgAuthInitResult: {
          responseId: 'CtxDACStiti',
          id: 'd4324b5a-271b-421d-a7dd-5eb63f0a167d',
          method: {
            type: 'SMS',
            id: '4ef28c99-eae9-4359-9b66-665e0113d9a5',
            maxSize: 8,
            minSize: 8,
            phoneNumber: '+3XXXXXXXX00',
          },
          unblockingDate: new Date('2021-03-01T16:44:46.000Z'),
          retries: 0,
        },
        icgAuthInitSession: [
          'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
          'ICG=4135777918.59233.0000; expires=Mon, 01-Mar-2021 16:44:40 GMT; path=/; Httponly; SameSite=none;Secure',
          'couloir=3; Path=/; SameSite=None;Secure',
          'JSESSIONID=g_q79CacgIjjZzzYRdvrt4uYZFFIyqxMstib6YqP.uq0mt051; path=/; secure; HttpOnly; SameSite=None',
        ],
        otpLength: 8,
      },
      customer: {
        email: smsUserEmail.address,
        uid: smsUserId,
      },
      channel: Channel.SMS,
      status: AuthStatus.BLOCKED,
      valid: false,
      expirationDate: new Date('2021-03-01T16:44:40.435Z'),
      factor: AuthFactor.OTP,
    });

    blockedVerifier = (await dependencies.verifierRepository.save(blockedVerifier)) as any;

    const resultPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });
    await expect(resultPromise).rejects.toThrow(AuthenticationError.AuthInitAuthenticationLocked);

    // remove unblocking date from verifier
    delete blockedVerifier.metadatas.icgAuthInitResult.unblockingDate;
    await dependencies.verifierRepository.save(blockedVerifier);
  });

  it('should throw BLOCKED_VERIFIER_NOT_FOUND exception when attempt to signing while ICG user locked but no locked verifier found', async () => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722';

    const authInitAuthenticationLockedResponse = {
      id: smsVerifierId,
      locale: 'en',
      context: {
        CTX_ONEY_BANKING: {
          SENDER_NAME: '12869',
          texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
          NOTIF_DESC: 'Demande authentification',
          SEND_NOTIF: 'true',
          NOTIF_TITLE: 'Opération sensible',
          DESC: "Demande d'ajout de bénéficiaire externe : MrXX",
        },
      },
      response: {
        status: 'AUTHENTICATION_LOCKED',
        saml2_post: {
          samlResponse:
            'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIu' +
            'MDpwcm90b2NvbCIgRGVzdGluYXRpb249InVybF9hcHBlbGFudCIgSUQ9IkN0eERBQ1NWRk8wMDFlNTJkNmZmNTc0' +
            'NDVkOWM3M2FhZmNjMzk2ZWJjMjIyIiBJblJlc3BvbnNlVG89Il8yMzI0NDI5MC1kNTAwLTRlYmEtOTBiNC1hODI5' +
            'N2QxZjJkNzUiIElzc3VlSW5zdGFudD0iMjAyMC0wOS0zMFQxOToxODoxNS42ODhaIiBWZXJzaW9uPSIyLjAiPjxz' +
            'YW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVyb' +
            'jpkaWN0YW86ZGFjczwvc2FtbDI6SXNzdWVyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT' +
            '0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMnA6U3RhdHVzQ29' +
            'kZT48c2FtbDJwOlN0YXR1c01lc3NhZ2U+TG9ja2VkPC9zYW1sMnA6U3RhdHVzTWVzc2FnZT48L3NhbWwycDpTdGF0' +
            'dXM+PC9zYW1sMnA6UmVzcG9uc2U+',
          action: 'url_appelant',
          method: 'POST',
        },
      },
    };

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          location: redirectPathname,
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
        },
      )
      .get(redirectPathname)
      .reply(200, authInitAuthenticationLockedResponse, {
        'set-cookie': [],
      });

    const resultPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });
    await expect(resultPromise).rejects.toThrow(AuthenticationError.VerifierNotFound);
  });

  it('should throw AUTH_INIT_AUTHENTICATION_FAILED_SMS_PROVIDER_ERROR when ICG SMS provider error', async () => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722';

    const authInitAuthenticationLockedResponse = {
      id: smsVerifierId,
      locale: 'en',
      context: {
        CTX_ONEY_BANKING: {
          SENDER_NAME: '12869',
          texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
          NOTIF_DESC: 'Demande authentification',
          SEND_NOTIF: 'true',
          NOTIF_TITLE: 'Opération sensible',
          DESC: "Demande d'ajout de bénéficiaire externe : MrXX",
        },
      },
      response: {
        status: 'AUTHENTICATION_FAILED',
        saml2_post: {
          samlResponse:
            'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpwcm90b2NvbC' +
            'IgRGVzdGluYXRpb249InVybF9hcHBlbGFudCIgSUQ9IkN0eERBQ1NMUTM4ZjI3NDFjYWVkNTI0OTU5OTc3ODA4YzM3NDA3YTJkMjIyIi' +
            'BJblJlc3BvbnNlVG89Il8zMGY1YjZjMi1iNDQwLTQxYzQtOWViNy1hZmM4MDUyMjEzOWUiIElzc3VlSW5zdGFudD0iMjAyMC0xMS0wNl' +
            'QxNTo1NDoxNi43NTRaIiBWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1lczp0YzpTQU1MO' +
            'jIuMDphc3NlcnRpb24iPnVybjpkaWN0YW86ZGFjczwvc2FtbDI6SXNzdWVyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYW' +
            'x1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMnA6U3RhdHVzQ29kZT48c2FtbDJwOlN' +
            '0YXR1c01lc3NhZ2U+Tm9QbHVnaW48L3NhbWwycDpTdGF0dXNNZXNzYWdlPjwvc2FtbDJwOlN0YXR1cz48L3NhbWwycDpSZXNwb25zZT4=',
          action: 'url_appelant',
          method: 'POST',
        },
      },
    };

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          location: redirectPathname,
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
        },
      )
      .get(redirectPathname)
      .reply(200, authInitAuthenticationLockedResponse, {
        'set-cookie': [],
      });

    const resultPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });
    await expect(resultPromise).rejects.toThrow(
      AuthenticationError.AuthInitAuthenticationFailedSmsProviderError,
    );
  });

  it('should throw AUTH_INIT_AUTHENTICATION_FAILED when ICG auth init error', async () => {
    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31c872d0223bd44d3b9c20a65f52fedf722';

    const authInitAuthenticationLockedResponse = {
      id: smsVerifierId,
      locale: 'en',
      context: {
        CTX_ONEY_BANKING: {
          SENDER_NAME: '12869',
          texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
          NOTIF_DESC: 'Demande authentification',
          SEND_NOTIF: 'true',
          NOTIF_TITLE: 'Opération sensible',
          DESC: "Demande d'ajout de bénéficiaire externe : MrXX",
        },
      },
      response: {
        status: 'AUTHENTICATION_FAILED',
        saml2_post: {
          samlResponse:
            'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpwcm90b2NvbCIgRGVz' +
            'dGluYXRpb249InVybF9hcHBlbGFudCIgSUQ9IkN0eERBQ1NMUTQ4MzY2MjIxMDg2OWI0ZGJiODdjZjBiMDMxODM5ZDI0YjIyIiBJblJlc3B' +
            'vbnNlVG89Il8yMmU1Yjg0OS01MDBhLTQ0YjgtOTU3Mi1mZGZmZTUyYzE2Y2YiIElzc3VlSW5zdGFudD0iMjAyMC0xMS0wNlQxNToyMDoyMy4zMTRaIi' +
            'BWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVybjpk' +
            'aWN0YW86ZGFjczwvc2FtbDI6SXNzdWVyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlN' +
            'BTUw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMnA6U3RhdHVzQ29kZT48c2FtbDJwOlN0YXR1c01lc3NhZ2U+dG90bzwvc2FtbDJwOlN0YXR' +
            '1c01lc3NhZ2U+PC9zYW1sMnA6U3RhdHVzPjwvc2FtbDJwOlJlc3BvbnNlPgo=',
          action: 'url_appelant',
          method: 'POST',
        },
      },
    };

    nock(icgAuthBaseUrl.href)
      .get(icgAuthSamlPath)
      .query({
        SAMLRequest: /.*/,
        SigAlg: /.*/,
        Signature: /.*/,
      })
      .reply(
        303,
        {},
        {
          location: redirectPathname,
          'set-cookie': [
            'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
        },
      )
      .get(redirectPathname)
      .reply(200, authInitAuthenticationLockedResponse, {
        'set-cookie': [],
      });

    const resultPromise = dependencies.requestSca.execute({
      userId: smsUserId,
    });
    await expect(resultPromise).rejects.toThrow(AuthenticationError.AuthInitAuthenticationFailed);
  });

  it('should fail CLOUDCARD verify with wrong less than 3 times', async () => {
    const icgAuthVerifyPath = icgVerifyPath.replace('$verifierId', cloudcardVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPath, _matchCloudcardAuthRequestPayload)
      .reply(200, {
        phase: {
          state: 'AUTHENTICATION',
          retryCounter: 2,
          fallbackFactorAvailable: false,
          previousResult: 'FAILED_AUTHENTICATION',
          securityLevel: '202',
        },
        validationUnits: [
          {
            '64c87611-5a2f-4028-ada5-c77ea8509e45': [
              {
                type: 'CLOUDCARD',
                id: '77fb1d12-a302-49bb-b372-1d3e04199372',
                asynchronousWaitingTime: 2000,
                cloudCardRequestId: '879f4bfb-7b69-4886-8ec3-1a2e892f8f84',
                requestTimeToLive: 420,
              },
            ],
          },
        ],
      });

    const result = await dependencies.verifyCredentials.execute({
      verifierId: cloudcardVerifierId,
    });

    expect(result.valid).toBeFalsy();
  });

  it('should fail CLOUDCARD verify with clearance rejected', async () => {
    const icgAuthVerifyPathSms = icgVerifyPath.replace('$verifierId', cloudcardVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPathSms, _matchCloudcardAuthRequestPayload)
      .reply(200, {
        id: cloudcardVerifierId,
        locale: 'en',
        response: {
          status: 'AUTHENTICATION_CANCELED',
          saml2_post: {
            samlResponse:
              'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMD' +
              'pwcm90b2NvbCIgRGVzdGluYXRpb249Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZXN1bHRhdCIgSUQ9' +
              'IkN0eERBQ1NWRk9lZjE3ZmJkYTIyNDg0ODY0OTcxYTE2YTI1YTFlMjg1NTIyIiBJblJlc3BvbnNlVG89I' +
              'l8zZTNiYjdiNC1jMTgyLTQ4ZjYtOTZjNi0yMTIwNjMxMmRmZDkiIElzc3VlSW5zdGFudD0iMjAyMC0wNi0' +
              'xMFQxMDo1MDo0MC42NzhaIiBWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybj' +
              'pvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVybjpkaWN0YW86ZGFjczwvc2FtbDI6SXNzdW' +
              'VyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBT' +
              'Uw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMnA6U3RhdHVzQ29kZT48c2FtbDJwOlN0YXR1c01lc3NhZ' +
              '2U+TG9ja2VkPC9zYW1sMnA6U3RhdHVzTWVzc2FnZT48L3NhbWwycDpTdGF0dXM+PC9zYW1sMnA6UmVzcG9uc2U+',
            action: 'http://localhost:8080/resultat',
            method: 'POST',
          },
        },
      });

    const result = await dependencies.verifyCredentials.execute({
      verifierId: cloudcardVerifierId,
    });

    expect(result.valid).toBeFalsy();
  });

  it('should fail CLOUDCARD verify with wrong PIN more than 3 times', async () => {
    const icgAuthVerifyPathSms = icgVerifyPath.replace('$verifierId', cloudcardVerifierId);

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPathSms, _matchCloudcardAuthRequestPayload)
      .reply(200, {
        id: cloudcardVerifierId,
        locale: 'en',
        context: {
          CTX_ONEY_BANKING: {
            SENDER_NAME: '12869',
            texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
            NOTIF_DESC: 'Demande authentification',
            SEND_NOTIF: 'true',
            NOTIF_TITLE: 'Opération sensible',
            DESC: "Demande d'ajout de bénéficiaire externe : Mr BERLON Philippe",
          },
        },
        response: {
          status: 'AUTHENTICATION_LOCKED',
          saml2_post: {
            samlResponse:
              'PHNhbWwycDpSZXNwb25zZSB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMD' +
              'pwcm90b2NvbCIgRGVzdGluYXRpb249Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZXN1bHRhdCIgSUQ9' +
              'IkN0eERBQ1NWRk9lZjE3ZmJkYTIyNDg0ODY0OTcxYTE2YTI1YTFlMjg1NTIyIiBJblJlc3BvbnNlVG89I' +
              'l8zZTNiYjdiNC1jMTgyLTQ4ZjYtOTZjNi0yMTIwNjMxMmRmZDkiIElzc3VlSW5zdGFudD0iMjAyMC0wNi0' +
              'xMFQxMDo1MDo0MC42NzhaIiBWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgeG1sbnM6c2FtbDI9InVybj' +
              'pvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPnVybjpkaWN0YW86ZGFjczwvc2FtbDI6SXNzdW' +
              'VyPjxzYW1sMnA6U3RhdHVzPjxzYW1sMnA6U3RhdHVzQ29kZSBWYWx1ZT0idXJuOm9hc2lzOm5hbWVzOnRjOlNBT' +
              'Uw6Mi4wOnN0YXR1czpBdXRobkZhaWxlZCI+PC9zYW1sMnA6U3RhdHVzQ29kZT48c2FtbDJwOlN0YXR1c01lc3NhZ' +
              '2U+TG9ja2VkPC9zYW1sMnA6U3RhdHVzTWVzc2FnZT48L3NhbWwycDpTdGF0dXM+PC9zYW1sMnA6UmVzcG9uc2U+',
            action: 'http://localhost:8080/resultat',
            method: 'POST',
          },
        },
      });

    const result = await dependencies.verifyCredentials.execute({
      verifierId: cloudcardVerifierId,
    });

    expect(result.valid).toBeFalsy();
  });

  it('should return a restricted verifier for an non-icg raw verifier with default credential length and email channel', async () => {
    const restrictedVerifierMapper: RestrictedVerifierMapper = kernel.get(RestrictedVerifierMapper);

    const rawVerifier = new StrongAuthVerifier({
      status: AuthStatus.PENDING,
      valid: false,
      factor: AuthFactor.OTP,
      channel: Channel.EMAIL,
      metadatas: null,
      verifierId: 'totoVerfier',
      customer: {
        email: 'toto@mail,fr',
        uid: 'toto999',
      },
      expirationDate: new Date(),
    });

    const restrictedVerifier = restrictedVerifierMapper.fromDomain(rawVerifier);

    await expect(restrictedVerifier).toMatchObject({
      ...rawVerifier,
      metadatas: {},
      code: '2FA_REQUESTED',
    });
  });

  it('should return a restricted verifier for an non-icg raw verifier with default credential length', async () => {
    const restrictedVerifierMapper: RestrictedVerifierMapper = kernel.get(RestrictedVerifierMapper);

    const rawVerifier = new StrongAuthVerifier({
      status: AuthStatus.PENDING,
      valid: false,
      factor: AuthFactor.OTP,
      channel: Channel.SMS,
      metadatas: null,
      verifierId: 'totoVerfier',
      customer: {
        email: 'toto@mail,fr',
        uid: 'toto999',
      },
      expirationDate: new Date(),
    });

    const restrictedVerifier = restrictedVerifierMapper.fromDomain(rawVerifier);

    await expect(restrictedVerifier).toMatchObject({
      ...rawVerifier,
      metadatas: {
        otpLength: 8,
      },
      code: '2FA_REQUESTED',
    });
  });

  it('should return a restricted verifier for an non-icg raw verifier with credential', async () => {
    const restrictedVerifierMapper: RestrictedVerifierMapper = kernel.get(RestrictedVerifierMapper);

    const rawVerifier = new StrongAuthVerifier({
      status: AuthStatus.PENDING,
      valid: false,
      factor: AuthFactor.OTP,
      channel: Channel.SMS,
      metadatas: null,
      verifierId: 'totoVerfier',
      customer: {
        email: 'toto@mail,fr',
        uid: 'toto999',
      },
      credential: '123456',
      expirationDate: new Date(),
    });

    const restrictedVerifier = restrictedVerifierMapper.fromDomain(rawVerifier);

    await expect(restrictedVerifier).toMatchObject({
      verifierId: rawVerifier.verifierId,
      action: rawVerifier.action,
      customer: rawVerifier.customer,
      status: rawVerifier.status,
      valid: rawVerifier.valid,
      factor: rawVerifier.factor,
      channel: rawVerifier.channel,
      expirationDate: rawVerifier.expirationDate,
      metadatas: {
        otpLength: rawVerifier.credential.length,
      },
      code: '2FA_REQUESTED',
    });
  });

  it('should return a restricted verifier for an non-icg raw verifier with expired token', async () => {
    const restrictedVerifierMapper: RestrictedVerifierMapper = kernel.get(RestrictedVerifierMapper);

    const rawVerifier = new StrongAuthVerifier({
      status: AuthStatus.EXPIRED,
      valid: false,
      factor: AuthFactor.OTP,
      channel: Channel.SMS,
      metadatas: null,
      verifierId: 'totoVerfier',
      customer: {
        email: 'toto@mail,fr',
        uid: 'toto999',
      },
      credential: '123456',
      expirationDate: new Date(),
    });

    const restrictedVerifier = restrictedVerifierMapper.fromDomain(rawVerifier);

    await expect(restrictedVerifier).toMatchObject({
      verifierId: rawVerifier.verifierId,
      action: rawVerifier.action,
      customer: rawVerifier.customer,
      status: rawVerifier.status,
      valid: rawVerifier.valid,
      factor: rawVerifier.factor,
      channel: rawVerifier.channel,
      expirationDate: rawVerifier.expirationDate,
      metadatas: {
        otpLength: rawVerifier.credential.length,
      },
      code: 'TOKEN_EXPIRED',
    });
  });

  it('should return a restricted verifier for an icg raw verifier', async () => {
    const restrictedVerifierMapper: RestrictedVerifierMapper = kernel.get(RestrictedVerifierMapper);

    const rawVerifier = new StrongAuthVerifier<StrongAuthVerifierMetadata<OtpSmsAuthMethod>>({
      status: AuthStatus.PENDING,
      valid: false,
      factor: AuthFactor.OTP,
      channel: Channel.SMS,
      metadatas: {
        icgAuthInitResult: {
          responseId: 'CtxDACSLQ42e19c41ab2594383abcb215b01733ee522',
          id: '1ca64360-4a32-486c-af1e-1314ab3738e3',
          method: {
            type: 'SMS',
            id: '2f4ae0e8-a580-40bb-98dd-0bc3b37ef761',
            maxSize: 8,
            minSize: 8,
            phoneNumber: '06XXXXXX32',
          },
          retries: null,
        },
        icgAuthInitSession: [
          'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=""; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
          'ICG=4152555134.59233.0000; expires=Wed, 03-Mar-2021 12:15:32 GMT; path=/; Httponly; SameSite=none;Secure',
          'couloir=3; Path=/; SameSite=None;Secure',
          'JSESSIONID=UEZtLrPqG6IQFKDA73k_BL_C1bbxRyR4w0UytSjs.uq0mt052; path=/; secure; HttpOnly; SameSite=None',
        ],
      },
      verifierId: 'totoVerfier',
      customer: {
        email: 'toto@mail,fr',
        uid: 'toto999',
      },
      expirationDate: new Date(),
    });

    const restrictedVerifier = restrictedVerifierMapper.fromDomain(rawVerifier);

    await expect(restrictedVerifier).toMatchObject({
      verifierId: rawVerifier.verifierId,
      action: rawVerifier.action,
      customer: rawVerifier.customer,
      status: rawVerifier.status,
      valid: rawVerifier.valid,
      factor: rawVerifier.factor,
      channel: rawVerifier.channel,
      expirationDate: rawVerifier.expirationDate,
      metadatas: {
        otpLength: rawVerifier.metadatas.icgAuthInitResult.method.maxSize,
      },
      code: '2FA_REQUESTED',
    });
  });

  it('should return a restricted verifier for an icg raw verifier with status done', async () => {
    const restrictedVerifierMapper: RestrictedVerifierMapper = kernel.get(RestrictedVerifierMapper);

    const rawVerifier = new StrongAuthVerifier<StrongAuthVerifierMetadata<OtpSmsAuthMethod>>({
      status: AuthStatus.DONE,
      valid: false,
      factor: AuthFactor.OTP,
      channel: Channel.SMS,
      metadatas: {
        icgAuthInitResult: {
          responseId: 'CtxDACSLQ42e19c41ab2594383abcb215b01733ee522',
          id: '1ca64360-4a32-486c-af1e-1314ab3738e3',
          method: {
            type: 'SMS',
            id: '2f4ae0e8-a580-40bb-98dd-0bc3b37ef761',
            maxSize: 8,
            minSize: 8,
            phoneNumber: '06XXXXXX32',
          },
          retries: null,
        },
        icgAuthInitSession: [
          'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=""; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
          'ICG=4152555134.59233.0000; expires=Wed, 03-Mar-2021 12:15:32 GMT; path=/; Httponly; SameSite=none;Secure',
          'couloir=3; Path=/; SameSite=None;Secure',
          'JSESSIONID=UEZtLrPqG6IQFKDA73k_BL_C1bbxRyR4w0UytSjs.uq0mt052; path=/; secure; HttpOnly; SameSite=None',
        ],
      },
      verifierId: 'totoVerfier',
      customer: {
        email: 'toto@mail,fr',
        uid: 'toto999',
      },
      expirationDate: new Date(),
    });

    const restrictedVerifier = restrictedVerifierMapper.fromDomain(rawVerifier);

    await expect(restrictedVerifier).toMatchObject({
      verifierId: rawVerifier.verifierId,
      action: rawVerifier.action,
      customer: rawVerifier.customer,
      status: rawVerifier.status,
      valid: rawVerifier.valid,
      factor: rawVerifier.factor,
      channel: rawVerifier.channel,
      expirationDate: rawVerifier.expirationDate,
      metadatas: {
        otpLength: rawVerifier.metadatas.icgAuthInitResult.method.maxSize,
      },
      code: '2FA_REQUESTED',
    });
  });

  it('should return a restricted verifier for an icg raw verifier with retries', async () => {
    const restrictedVerifierMapper: RestrictedVerifierMapper = kernel.get(RestrictedVerifierMapper);

    const rawVerifier = new StrongAuthVerifier<StrongAuthVerifierMetadata<OtpSmsAuthMethod>>({
      status: AuthStatus.PENDING,
      valid: false,
      factor: AuthFactor.OTP,
      channel: Channel.SMS,
      metadatas: {
        icgAuthInitResult: {
          responseId: 'CtxDACSLQ42e19c41ab2594383abcb215b01733ee522',
          id: '1ca64360-4a32-486c-af1e-1314ab3738e3',
          method: {
            type: 'SMS',
            id: '2f4ae0e8-a580-40bb-98dd-0bc3b37ef761',
            maxSize: 8,
            minSize: 8,
            phoneNumber: '06XXXXXX32',
          },
          retries: 2,
        },
        icgAuthInitSession: [
          'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=""; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
          'ICG=4152555134.59233.0000; expires=Wed, 03-Mar-2021 12:15:32 GMT; path=/; Httponly; SameSite=none;Secure',
          'couloir=3; Path=/; SameSite=None;Secure',
          'JSESSIONID=UEZtLrPqG6IQFKDA73k_BL_C1bbxRyR4w0UytSjs.uq0mt052; path=/; secure; HttpOnly; SameSite=None',
        ],
      },
      verifierId: 'totoVerfier',
      customer: {
        email: 'toto@mail,fr',
        uid: 'toto999',
      },
      expirationDate: new Date(),
    });

    const restrictedVerifier = restrictedVerifierMapper.fromDomain(rawVerifier);

    await expect(restrictedVerifier).toMatchObject({
      verifierId: rawVerifier.verifierId,
      action: rawVerifier.action,
      customer: rawVerifier.customer,
      status: rawVerifier.status,
      valid: rawVerifier.valid,
      factor: rawVerifier.factor,
      channel: rawVerifier.channel,
      expirationDate: rawVerifier.expirationDate,
      metadatas: {
        otpLength: rawVerifier.metadatas.icgAuthInitResult.method.maxSize,
        retries: rawVerifier.metadatas.icgAuthInitResult.retries,
      },
      code: '2FA_REQUESTED',
    });
  });

  it('should return a blocked restricted verifier for an icg raw verifier', async () => {
    const restrictedVerifierMapper: RestrictedVerifierMapper = kernel.get(RestrictedVerifierMapper);

    const rawVerifier = new StrongAuthVerifier<StrongAuthVerifierMetadata<OtpSmsAuthMethod>>({
      status: AuthStatus.BLOCKED,
      valid: false,
      factor: AuthFactor.OTP,
      channel: Channel.SMS,
      metadatas: {
        icgAuthInitResult: {
          responseId: 'CtxDACSLQ42e19c41ab2594383abcb215b01733ee522',
          id: '1ca64360-4a32-486c-af1e-1314ab3738e3',
          method: {
            type: 'SMS',
            id: '2f4ae0e8-a580-40bb-98dd-0bc3b37ef761',
            maxSize: 8,
            minSize: 8,
            phoneNumber: '06XXXXXX32',
          },
          retries: 0,
          unblockingDate: new Date(),
        },
        icgAuthInitSession: [
          'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=""; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
          'ICG=4152555134.59233.0000; expires=Wed, 03-Mar-2021 12:15:32 GMT; path=/; Httponly; SameSite=none;Secure',
          'couloir=3; Path=/; SameSite=None;Secure',
          'JSESSIONID=UEZtLrPqG6IQFKDA73k_BL_C1bbxRyR4w0UytSjs.uq0mt052; path=/; secure; HttpOnly; SameSite=None',
        ],
      },
      verifierId: 'totoVerfier',
      customer: {
        email: 'toto@mail,fr',
        uid: 'toto999',
      },
      expirationDate: new Date(),
    });

    const restrictedVerifier = restrictedVerifierMapper.fromDomain(rawVerifier);

    await expect(restrictedVerifier).toMatchObject({
      verifierId: rawVerifier.verifierId,
      action: rawVerifier.action,
      customer: rawVerifier.customer,
      status: rawVerifier.status,
      valid: rawVerifier.valid,
      factor: rawVerifier.factor,
      channel: rawVerifier.channel,
      expirationDate: rawVerifier.expirationDate,
      metadatas: {
        otpLength: rawVerifier.metadatas.icgAuthInitResult.method.maxSize,
        unblockingDate: rawVerifier.metadatas.icgAuthInitResult.unblockingDate,
      },
      code: '2FA_REQUESTED',
    });
  });

  afterAll(async done => {
    nock.cleanAll();
    done();
  });
});
