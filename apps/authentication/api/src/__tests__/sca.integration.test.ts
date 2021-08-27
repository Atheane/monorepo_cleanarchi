/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { VerifierMapper } from '@oney/authentication-adapters';
import {
  ActionsType,
  AuthenticationError,
  AuthFactor,
  AuthIdentifier,
  AuthStatus,
  Channel,
  DefaultUiErrorMessages,
  IdentityEncodingService,
  StrongAuthVerifier,
  VerifierRepository,
} from '@oney/authentication-core';
import { DecodeIdentity } from '@oney/identity-core';
import { Application } from 'express';
import * as express from 'express';
import * as httpStatus from 'http-status';
import * as nock from 'nock';
import * as request from 'supertest';
import * as path from 'path';
import { getUserToken, getUserWithPhoneToken, userWithPhone } from './fixtures/auth.fixtures';
import { bootstrap } from './fixtures/bootstrap';
import { AppKernel } from '../config/di/AppKernel';
import { envConfiguration } from '../config/server/Envs';

const app: Application = express();

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

describe('Sca integration api testing', () => {
  let container: AppKernel;
  let scaToken: string;
  let identityEncoder: IdentityEncodingService;
  let userToken: string;
  let scaTokenMapper: VerifierMapper;
  let decodeIdentity: DecodeIdentity;
  let userWithPhoneToken: string;
  let verifierRepository: VerifierRepository;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);
    userToken = await getUserToken(container);
    userWithPhoneToken = await getUserWithPhoneToken(container);
    verifierRepository = container.get<VerifierRepository>(AuthIdentifier.verifierRepository);
    identityEncoder = container.get<IdentityEncodingService>(AuthIdentifier.identityEncodingService);
    scaTokenMapper = new VerifierMapper();
    decodeIdentity = container.get(DecodeIdentity);
  });

  it('Should return instance of StrongAuthVerifier [POST] /auth/verifier', async () => {
    // Given
    const result = {
      status: AuthStatus.PENDING,
      factor: AuthFactor.OTP,
      channel: Channel.EMAIL,
      valid: false,
    };

    // When
    return request(app)
      .post('/authentication/sca/verifier')
      .send({
        action: {
          type: 'SIGN_IN',
          payload: {
            name: 'SIGN_IN',
            request: {
              body: { email: 'toto@toot.com' },
            },
          },
        },
      })
      .set('Authorization', `bearer ${userToken}`)
      .expect(403)
      .expect(response => {
        // Then
        scaToken = response.header.sca_token;
        const { body } = response;
        expect(body.status).toMatch(result.status);
        expect(body.factor).toMatch(result.factor);
        expect(body.channel).toMatch(result.channel);
        expect(body.valid).toBeFalsy();
      });
  });

  it('Should be rejected cause auth is non valid', async () =>
    request(app)
      .get('/authentication/sca/verifier')
      .set('Authorization', `bearer ${userToken}`)
      .set('sca_token', scaToken)
      .expect(200));

  it('Should be rejected cause user token non provided', async () =>
    request(app).get('/authentication/sca/verifier').set('sca_token', scaToken).expect(401));

  it('Should throw an error cause supply a bad token', async () => {
    // Given
    const result = {
      status: AuthStatus.PENDING,
      factor: AuthFactor.OTP,
      channel: Channel.EMAIL,
      valid: false,
    };

    // When
    return request(app)
      .get('/authentication/sca/verifier')
      .set('Authorization', `bearer ${userToken}`)
      .set('sca_token', 'iamthebatman')
      .expect(403)
      .expect(response => {
        const { body } = response;
        expect(body.status).toMatch(result.status);
        expect(body.factor).toMatch(result.factor);
        expect(body.channel).toMatch(result.channel);
        expect(body.valid).toBeFalsy();
      });
  });

  it('Should return an invalid verifier cause credential is invalid [POST] /auth/verify', async () => {
    // Given
    const verifier = {
      credentials: '123456789',
    };

    // When
    return request(app)
      .post('/authentication/sca/verify')
      .set('Authorization', `bearer ${userToken}`)
      .set('sca_token', scaToken)
      .send(verifier)
      .expect(400)
      .expect(response => {
        // Then
        expect(response.body.type).toEqual('BAD_CREDENTIALS');
      });
  });

  it('Should reject with 401 cause token is no provided', async () => {
    const result = {
      status: AuthStatus.PENDING,
      factor: AuthFactor.OTP,
      channel: Channel.EMAIL,
      valid: false,
      code: '2FA_REQUESTED',
    };

    return request(app)
      .get('/authentication/sca/verifier')
      .set('Authorization', `bearer ${userToken}`)
      .expect(403)
      .expect(response => {
        // THEN
        const { body } = response;
        expect(body.valid).toBeFalsy();
        expect(body.factor).toMatch(result.factor);
        expect(body.channel).toMatch(result.channel);
      });
  });

  it('Should return a valid verifier cause credentials are valid [POST] /auth/verify', async () => {
    // Given
    const verifier = {
      credentials: '00000000',
    };

    // When
    return request(app)
      .post('/authentication/sca/verify')
      .set('sca_token', scaToken)
      .set('Authorization', `bearer ${userToken}`)
      .send(verifier)
      .expect(200)
      .expect(response => {
        // Then
        expect(response.body.valid).toBeTruthy();
        expect(response.body.status).toMatch(AuthStatus.DONE);
      });
  });

  it('Should return a failed verifier after 3 wrong OTP SMS retries [POST] /auth/verify', async () => {
    const { icgBaseUrl, icgVerifyPath } = envConfiguration.getLocalVariables().icgConfig;
    const icgAuthBaseUrl = new URL(icgBaseUrl);
    const smsVerifierId = 'smsVerifierId';
    const icgAuthVerifyPathSms = icgVerifyPath.replace('$verifierId', smsVerifierId);
    const validationUnitId = 'titi123';
    const method = {
      type: 'SMS',
      id: 'toto123',
    };
    const wrongOtpSms = '658756';
    const smsVerifyReqBody = {
      validate: {
        [validationUnitId]: [
          {
            type: method.type,
            id: method.id,
            otp_sms: wrongOtpSms,
          },
        ],
      },
    };

    nock(icgAuthBaseUrl.href)
      .post(icgAuthVerifyPathSms, smsVerifyReqBody)
      .reply(200, {
        id: smsVerifierId,
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

    const decodedPhoneUser = await decodeIdentity.execute({
      holder: userWithPhoneToken,
    });

    const toFailVerifier = await verifierRepository.save(
      new StrongAuthVerifier({
        channel: Channel.SMS,
        valid: false,
        status: AuthStatus.PENDING,
        verifierId: smsVerifierId,
        expirationDate: new Date('2120-01-01'),
        credential: null,
        factor: AuthFactor.OTP,
        customer: {
          uid: decodedPhoneUser.uid,
          email: decodedPhoneUser.email,
        },
        metadatas: {
          icgAuthInitResult: {
            method: {
              type: method.type,
              id: method.id,
            },
            id: validationUnitId,
            responseId: smsVerifierId,
          },
          otpLength: 8,
          icgAuthInitSession: [
            'JSESSIONID=RgCb6jc_3e6EEPszJlan7Ksl4rp18nSNuURadKZA.uq0mt051; path=/dacswebssoissuer; HttpOnly; Secure; SameSite=None',
            'ICG=4135777918.59233.0000; expires=Wed, 12-Aug-2020 20:07:27 GMT; path=/; Httponly;Secure',
            'couloir=3; Path=/;Secure',
          ],
        },
      }),
    );
    const scaTokenCustom = identityEncoder.scaToken.encode(scaTokenMapper.fromDomain(toFailVerifier));

    // Given
    const payload = {
      credentials: wrongOtpSms,
    };

    // When
    return request(app)
      .post('/authentication/sca/verify')
      .set('sca_token', scaTokenCustom)
      .send(payload)
      .expect(200)
      .expect(response => {
        // Then
        expect(response.body.valid).toBeFalsy();
        expect(response.body.status).toMatch(AuthStatus.FAILED);
      });
  });

  it('Should return a 429 error after 3 active OTP SMS [POST] /auth/verifier', async () => {
    const { icgBaseUrl, icgSamlPath } = envConfiguration.getLocalVariables().icgConfig;
    const icgAuthBaseUrl = new URL(icgBaseUrl);

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
      .get(icgSamlPath)
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

    // When
    return request(app)
      .post('/authentication/sca/verifier')
      .set('Authorization', `bearer ${userWithPhoneToken}`)
      .expect(429)
      .expect(response => {
        const { safeMessage } = new AuthenticationError.AuthInitTooManyAuthSessionsForUser(
          userWithPhone.props.uid,
        );

        // Then
        expect(response.body).toEqual({
          code: httpStatus.TOO_MANY_REQUESTS,
          type: safeMessage,
          message: DefaultUiErrorMessages.AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER,
          uid: userWithPhone.props.uid,
        });
      });
  });

  it('Should return a 404 error when user unknown by ICG [POST] /auth/verifier', async () => {
    const { icgBaseUrl, icgSamlPath } = envConfiguration.getLocalVariables().icgConfig;
    const icgAuthBaseUrl = new URL(icgBaseUrl);

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
      .get(icgSamlPath)
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

    // When
    return request(app)
      .post('/authentication/sca/verifier')
      .set('Authorization', `bearer ${userWithPhoneToken}`)
      .expect(404)
      .expect(response => {
        const { safeMessage, cause } = new AuthenticationError.AuthInitUnknownUser(userWithPhone.props.uid);

        // Then
        expect(response.body).toEqual({
          code: httpStatus.NOT_FOUND,
          type: safeMessage,
          message: cause.msg,
          uid: cause.uid,
        });
      });
  });

  it('Should return a 423 error when signing in while ICG user with unblocking date locked [POST] /auth/verifier', async () => {
    const { icgBaseUrl, icgSamlPath } = envConfiguration.getLocalVariables().icgConfig;
    const icgAuthBaseUrl = new URL(icgBaseUrl);

    const blockedVerifier = new StrongAuthVerifier<{ icgAuthInitResult: { unblockingDate: Date } }>({
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
        email: userWithPhone.props.email.address,
        uid: userWithPhone.props.uid,
      },
      channel: Channel.SMS,
      status: AuthStatus.BLOCKED,
      valid: false,
      expirationDate: new Date('2021-03-01T16:44:40.435Z'),
      factor: AuthFactor.OTP,
    });
    await verifierRepository.save(blockedVerifier);

    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522';
    const authInitAuthenticationLockedResponse = {
      id: 'CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522',
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
      .get(icgSamlPath)
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
      .reply(200, authInitAuthenticationLockedResponse, {
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

    const lockedStatusCode = 423;

    // When
    await request(app)
      .post('/authentication/sca/verifier')
      .set('Authorization', `bearer ${userWithPhoneToken}`)
      .expect(lockedStatusCode)
      .expect(response => {
        const { safeMessage, cause } = new AuthenticationError.AuthInitAuthenticationLocked(
          userWithPhone.props.uid,
          new Date(),
        );

        // Then
        expect(response.body).toEqual({
          code: lockedStatusCode,
          type: safeMessage,
          message: cause.msg,
          uid: cause.uid,
          unblockingDate: cause.unlockingDate,
        });
      });

    // remove unblockingDate field
    delete blockedVerifier.metadatas.icgAuthInitResult.unblockingDate;
    await verifierRepository.save(blockedVerifier);
  });
  it('Should return a 400 error when signing in while ICG user locked but no blocked verifier found [POST] /auth/verifier', async () => {
    const { icgBaseUrl, icgSamlPath } = envConfiguration.getLocalVariables().icgConfig;
    const icgAuthBaseUrl = new URL(icgBaseUrl);

    const redirectPathname = '/dacsrest/api/v1u0/transaction/CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522';
    const authInitAuthenticationLockedResponse = {
      id: 'CtxDACSLQ31ad53a5806934a5782737ed0ba4d83d522',
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
      .get(icgSamlPath)
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
      .reply(200, authInitAuthenticationLockedResponse, {
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

    const defaultErrorCode = 400;

    // When
    return request(app)
      .post('/authentication/sca/verifier')
      .set('Authorization', `bearer ${userWithPhoneToken}`)
      .expect(defaultErrorCode)
      .expect(response => {
        // Then
        expect(response.body).toEqual({
          code: 400,
          type: 'VERIFIER_NOT_FOUND',
          message: 'An error occurred. Please try later',
          reason: 'BLOCKED_VERIFIER_NOT_FOUND',
        });
      });
  });

  it('Should return a 400 error when error when invalid sca token [POST] /auth/verifier', async () => {
    const invalidScaToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmllcklkIjoiQ3R4REFDU1ZGT2FhOWE1YjFjMGIwOTR' +
      'lMjFiNjFjMTdmZDdjOWI0YzBlMjIiLCJjdXN0b21lciI6eyJlbWFpbCI6InRlc3RwaG9uZXN0MXNAe' +
      'W9wbWFpbC5jb20iLCJ1aWQiOiJWRk9fVVNFUl9URVNUX1hfMDAxIn0sImlhdCI6MTYwMjc1OTkxMSwiZ' +
      'XhwIjoxNjAyNzYwMjExLCJhdWQiOiJvZGJfYXV0aGVudGljYXRpb25fZGV2IiwiaXNzIjoib2RiX2F1dG' +
      'hlbnRpY2F0aW9uIn0.Siarg3yX5RiCxdI_QhRkncM0HGwLM2HQPQotz8stDT';

    // When
    return request(app)
      .post('/authentication/sca/verify')
      .set('sca_token', invalidScaToken)
      .set('Authorization', `bearer ${userWithPhoneToken}`)
      .expect(400)
      .expect(response => {
        // Then
        expect(response.body).toEqual({
          code: 400,
          message: 'An error occurred. Please try later',
          type: 'TYPE_ERROR',
          reason: "Cannot read property 'uid' of undefined",
        });
      });
  });

  it('Should reject because verifierId cannot be found', async () => {
    const verifier = verifierRepository.findById('123576');
    await expect(verifier).rejects.toThrow(AuthenticationError.VerifierNotFound);
  });

  it('Should create a new auth cause verifier is expired', async () => {
    // GIVEN
    const result = {
      status: AuthStatus.PENDING,
      factor: AuthFactor.OTP,
      channel: Channel.EMAIL,
      valid: false,
    };

    const decodedUser = await decodeIdentity.execute({
      holder: userToken,
    });

    const verifier = await verifierRepository.save(
      new StrongAuthVerifier({
        channel: Channel.EMAIL,
        valid: true,
        status: AuthStatus.DONE,
        verifierId: 'aze55za5e5aze',
        expirationDate: new Date(),
        credential: '00000000',
        factor: AuthFactor.OTP,
        action: {
          type: ActionsType.SCA_REQUEST,
          payload: null,
        },
        customer: {
          uid: decodedUser.uid,
          email: decodedUser.email,
        },
      }),
    );

    const scaTokenCustom = identityEncoder.scaToken.encode(scaTokenMapper.fromDomain(verifier));

    return request(app)
      .get('/authentication/sca/verifier')
      .set('sca_token', scaTokenCustom)
      .set('Authorization', `bearer ${userToken}`)
      .expect(403)
      .expect(response => {
        const { body } = response;
        expect(body.status).toMatch(result.status);
        expect(body.factor).toMatch(result.factor);
        expect(body.channel).toMatch(result.channel);
        expect(body.valid).toBeFalsy();
      });
  });

  it('Should return a 401 cause user_token not valid', async () => {
    // GIVEN
    const payload = {
      userToken: '55555',
    };

    // WHEN
    return request(app)
      .post('/authentication/sca/verifier')
      .set('sca_token', scaToken)
      .set('Authorization', `bearer ${payload.userToken}`)
      .expect(401);
  });

  it('Should return a 200 and update the verifier consumption date', async () => {
    // GIVEN
    const result = {
      verifierId: 'iqhjwiuh3r3r',
    };
    const decodedUser = await decodeIdentity.execute({
      holder: userToken,
    });

    const verifier = await verifierRepository.save(
      new StrongAuthVerifier({
        status: AuthStatus.PENDING,
        verifierId: result.verifierId,
        factor: AuthFactor.OTP,
        expirationDate: new Date(new Date().valueOf() + 1000 * 3600 * 24),
        valid: false,
        channel: Channel.EMAIL,
        credential: '00000000',
        action: {
          type: 'SIGN_IN',
          payload: Buffer.from(
            JSON.stringify({
              request: {
                body: { email: 'oneytest2@yopmail.com' },
                headers: {},
                url: 'http://localhost/auth/signin',
              },
            }),
            'utf8',
          ).toString('base64'),
        },
        customer: {
          uid: decodedUser.uid,
          email: decodedUser.email,
        },
      }),
    );
    const scaTokenCustom = identityEncoder.scaToken.encode(scaTokenMapper.fromDomain(verifier));

    // WHEN
    return request(app)
      .post('/authentication/sca/consume')
      .set('sca_token', scaTokenCustom)
      .set('Authorization', `bearer ${userToken}`)
      .expect(200)
      .expect(response => {
        const { body } = response;
        expect(body.verifierId).toMatch(result.verifierId);
        expect(body.action.consumedAt).not.toBeNull();
      });
  });
});
