import {
  AuthFactor,
  AuthRequestPayload,
  AuthResponseContext,
  AuthStatus,
  Channel,
  Email,
  OtpSmsAuthMethod,
  PinAuthMethod,
  StrongAuthVerifier,
  User,
  UserRepository,
  VerifierRepository,
} from '@oney/authentication-core';
import {
  successSamlResponse,
  successSamlResponseUnsigned,
  successSamlResponseInvalidSignature,
} from './successSamlResponse';
import { ValidationMethodType } from '../../../adapters/types/icg/ValidationMethodType';
import { StrongAuthVerifierMetadata } from '../../../adapters/types/icg/StrongAuthVerifierMetadata';

export interface RedirectResponsePayloadContextPart {
  id: string;
  locale: string;
  context: AuthResponseContext;
}

export function generateRandomId(): string {
  return new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
}
export function generateRandomPhone(): string {
  return Math.floor(100000 + Math.random() * 9000000000).toString();
}
export function generateRandomSmsOtpLenght8(): string {
  return '' + Math.floor(100000 + Math.random() * 90000000);
}

export function generateRandomAuthVerifyPath(path: string, randomVerifierId: string): string {
  return path.replace('$verifierId', randomVerifierId);
}

export function generateRandomUser(): User {
  const ruid = generateRandomId();
  const randomPhone = generateRandomPhone();
  return new User({
    uid: ruid,
    email: Email.from(`${ruid}@rand.com`),
    phone: generateRandomPhone(),
    metadata: { phone: randomPhone },
    provisioning: {
      partnerUid: `12869@${ruid}`,
      phone: { success: true, date: new Date() },
    },
  });
}

export function generateRandomSmsVerifierWithMetadata(
  verifierId: string,
  ruid: string,
): StrongAuthVerifier<StrongAuthVerifierMetadata<OtpSmsAuthMethod>> {
  return new StrongAuthVerifier({
    verifierId,
    factor: AuthFactor.OTP,
    expirationDate: new Date('02-05-2120'),
    valid: false,
    status: AuthStatus.PENDING,
    credential: null,
    channel: Channel.SMS,
    customer: {
      email: `${ruid}@rand.com`,
      uid: ruid,
    },
    metadatas: {
      icgAuthInitResult: {
        responseId: verifierId,
        id: generateRandomId(),
        method: {
          type: 'SMS',
          id: generateRandomId(),
          maxSize: 8,
          minSize: 8,
          phoneNumber: 'XXXXXXXX5855',
        },
      },
      icgAuthInitSession: [
        'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=""; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT;Secure;SameSite=None;',
        'JSESSIONID=taXCIOWdUzzBJS5nohzaYw-kFeKnA9ADXYctWzg1.uv0mt012; path=/; secure; HttpOnly;Secure;SameSite=None;',
      ],
      otpLength: 8,
    },
  });
}

export function generateRandomCloudcardVerifierWithMetadata(
  verifierId: string,
  ruid: string,
): StrongAuthVerifier<StrongAuthVerifierMetadata<PinAuthMethod>> {
  return new StrongAuthVerifier({
    verifierId,
    factor: AuthFactor.CLOUDCARD,
    expirationDate: new Date('02-05-2120'),
    valid: false,
    status: AuthStatus.PENDING,
    credential: null,
    channel: null,
    customer: {
      email: `${ruid}@rand.com`,
      uid: ruid,
    },
    metadatas: {
      icgAuthInitResult: {
        responseId: verifierId,
        id: generateRandomId(),
        method: {
          type: 'CLOUDCARD',
          id: generateRandomId(),
          asynchronousWaitingTime: 1000,
          cloudCardRequestId: generateRandomId(),
          requestTimeToLive: 500,
        },
      },
      icgAuthInitSession: [
        'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=""; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT;Secure;SameSite=None;',
        'JSESSIONID=taXCIOWdUzzBJS5nohzaYw-kFeKnA9ADXYctWzg1.uv0mt012; path=/; secure; HttpOnly;Secure;SameSite=None;',
      ],
    },
  });
}

export function generateRandomExpiredSmsVerifierBeforeVerify(vId: string, ruid: string): StrongAuthVerifier {
  return new StrongAuthVerifier({
    verifierId: vId,
    factor: AuthFactor.OTP,
    expirationDate: new Date('02-05-2020'),
    valid: false,
    status: AuthStatus.PENDING,
    credential: null,
    channel: Channel.SMS,
    customer: {
      email: `${ruid}@rand.com`,
      uid: ruid,
    },
    metadatas: null,
  });
}

export function generateRandomExpiredCloudcardVerifierBeforeVerify(
  vId: string,
  ruid: string,
): StrongAuthVerifier {
  return new StrongAuthVerifier({
    verifierId: vId,
    factor: AuthFactor.CLOUDCARD,
    expirationDate: new Date('02-05-2020'),
    valid: false,
    status: AuthStatus.PENDING,
    credential: null,
    channel: null,
    customer: {
      email: `${ruid}@rand.com`,
      uid: ruid,
    },
    metadatas: null,
  });
}

export function generateRandomRedirectPathname(vId: string): string {
  return `/dacsrest/api/v1u0/transaction/CtxDACS${vId}`;
}

export function generateSamlAuthInitResponseHeaders(
  redirectPathname: string,
): { location: string; 'set-cookie': string[] } {
  return {
    location: redirectPathname,
    'set-cookie': [
      'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=tmp8ca4c68aec594273bb8c119b5a9317bf; path=/; secure; HttpOnly; SameSite=None',
      'ICG=4135777918.59233.0000; expires=Thu, 06-Aug-2020 09:35:56 GMT; path=/; Httponly;Secure',
      'couloir=3; Path=/;Secure',
    ],
  };
}

export function generateAuthInitRedirectResponseHeaders(): { 'set-cookie': string[] } {
  return {
    'set-cookie': [
      'HTTPWORKFLOW_TRANSIENT_ATTRIBUTES=; path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Secure; SameSite=None',
      'JSESSIONID=fLIhn6TPNwFcpNmhZwNCJyu14tiI8a-H_iI-FYqh.uq0mt052; path=/; secure; HttpOnly; SameSite=None',
      'ICG=4152555134.59233.0000; expires=Thu, 06-Aug-2020 19:40:59 GMT; path=/; Httponly;Secure',
    ],
  };
}

export function generateGenericNockQueryMatcher(): {
  SAMLRequest: RegExp;
  SigAlg: RegExp;
  Signature: RegExp;
} {
  return {
    SAMLRequest: /.*/,
    SigAlg: /.*/,
    Signature: /.*/,
  };
}

export function generateAuthInitRedirectResponsePayloadContextPart(
  verifierId: string,
): RedirectResponsePayloadContextPart {
  return {
    id: verifierId,
    locale: 'en',
    context: {
      CTX_ONEY_BANKING: {
        SENDER_NAME: '12869',
        texte_sms: 'Banque Oney Digitale\rValidation de lacces a votre application mobile\rCode :',
        NOTIF_DESC: 'Demande authentification',
        SEND_NOTIF: 'true',
        NOTIF_TITLE: 'Opération sensible',
        DESC: "Demande d'ajout de bénéficiaire externe : Mr XX",
      },
    },
  };
}

export function generateSmsValidationUnits(): {
  [x: string]: { type: any; id: string; maxSize: number; minSize: number; phoneNumber: string }[];
}[] {
  return [
    {
      [generateRandomId()]: [
        {
          type: 'SMS',
          id: generateRandomId(),
          maxSize: 8,
          minSize: 8,
          phoneNumber: '06XXXXXX17',
        },
      ],
    },
  ];
}

export function generateAuthInitRedirectResponsePayloadPhase(): {
  state: string;
  retryCounter: number;
  fallbackFactorAvailable: boolean;
  securityLevel: string;
} {
  return {
    state: 'AUTHENTICATION',
    retryCounter: 3,
    fallbackFactorAvailable: false,
    securityLevel: '202',
  };
}

export function generateCloudcardValidationUnits(): {
  [x: string]: {
    type: string;
    id: string;
    asynchronousWaitingTime: number;
    cloudCardRequestId: string;
    requestTimeToLive: number;
  }[];
}[] {
  return [
    {
      [generateRandomId()]: [
        {
          type: 'CLOUDCARD',
          id: '77fb1d12-a302-49bb-b372-1d3e04199372',
          asynchronousWaitingTime: 2000,
          cloudCardRequestId: '879f4bfb-7b69-4886-8ec3-1a2e892f8f84',
          requestTimeToLive: 420,
        },
      ],
    },
  ];
}

export function generateUnknownValidationUnits(): {
  [x: string]: { type: string; id: string; maxSize: number; minSize: number; phoneNumber: string }[];
}[] {
  return [
    {
      [generateRandomId()]: [
        {
          type: 'UNKNOWN_TYPE_FROM_ICG',
          id: 'c8fa7fce-0820-4855-8571-c3be11b41e6f',
          maxSize: 8,
          minSize: 8,
          phoneNumber: '06XXXXXX17',
        },
      ],
    },
  ];
}

export function generateAuthInitRedirectResponseSmsPayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  step: {
    phase: { state: string; retryCounter: number; fallbackFactorAvailable: boolean; securityLevel: string };
    validationUnits: {
      [x: string]: { type: any; id: string; maxSize: number; minSize: number; phoneNumber: string }[];
    }[];
  };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
    step: {
      phase: generateAuthInitRedirectResponsePayloadPhase(),
      validationUnits: generateSmsValidationUnits(),
    },
  };
}

export function generateAuthInitRedirectResponseUnknownPayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  step: {
    phase: {
      state: string;
      retryCounter: number;
      fallbackFactorAvailable: boolean;
      securityLevel: string;
    };
    validationUnits: {
      [x: string]: {
        type: string;
        id: string;
        maxSize: number;
        minSize: number;
        phoneNumber: string;
      }[];
    }[];
  };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
    step: {
      phase: generateAuthInitRedirectResponsePayloadPhase(),
      validationUnits: generateUnknownValidationUnits(),
    },
  };
}

export function generateAuthInitRedirectResponseCloudcardPayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  step: {
    phase: {
      state: string;
      retryCounter: number;
      fallbackFactorAvailable: boolean;
      securityLevel: string;
    };
    validationUnits: {
      [x: string]: {
        type: string;
        id: string;
        asynchronousWaitingTime: number;
        cloudCardRequestId: string;
        requestTimeToLive: number;
      }[];
    }[];
  };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
    step: {
      phase: generateAuthInitRedirectResponsePayloadPhase(),
      validationUnits: generateCloudcardValidationUnits(),
    },
  };
}

export function generateSamlAuthInitResponseHeadersWithRedirect(
  redirectPathname: string,
): {
  date: string;
  'set-cookie': string[];
  'strict-transport-security': string;
  'x-content-type-options': string;
  'content-security-policy': string;
  'x-xss-protection': string;
  p3p: string;
  location: string;
  'content-length': string;
  'content-type': string;
  connection: string;
} {
  return {
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
    location: redirectPathname,
    'content-length': '0',
    'content-type': 'text/plain',
    connection: 'close',
  };
}

export function generateAuthInitRedirectResponseFullHeaders(): {
  date: string;
  'set-cookie': string[];
  'strict-transport-security': string;
  'x-content-type-options': string;
  'content-security-policy': string;
  'x-xss-protection': string;
  expires: string;
  'cache-control': string;
  pragma: string;
  'content-type': string;
  connection: string;
} {
  return {
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
  };
}

export function generateRedirectExceedResponsePayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  response: { status: string; saml2_post: { samlResponse: string; action: string; method: string } };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
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
}

export function generateRedirectUnknownUserResponsePayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  response: { status: string; saml2_post: { samlResponse: string; action: string; method: string } };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
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
}

export function generateAuthVerifySuccessWithSamlResponse(): {
  status: string;
  saml2_post: { samlResponse: string; action: string; method: string };
} {
  return {
    status: 'AUTHENTICATION_SUCCESS',
    saml2_post: {
      samlResponse: successSamlResponse,
      action: 'url_appelant',
      method: 'POST',
    },
  };
}

export function generateAuthVerifySuccessWithUnsignedSamlResponse(): {
  status: string;
  saml2_post: { samlResponse: string; action: string; method: string };
} {
  return {
    status: 'AUTHENTICATION_SUCCESS',
    saml2_post: {
      samlResponse: successSamlResponseUnsigned,
      action: 'url_appelant',
      method: 'POST',
    },
  };
}

export function generateAuthVerifySuccessWithSamlResponseWithInvalidSignature(): {
  status: string;
  saml2_post: { samlResponse: string; action: string; method: string };
} {
  return {
    status: 'AUTHENTICATION_SUCCESS',
    saml2_post: {
      samlResponse: successSamlResponseInvalidSignature,
      action: 'url_appelant',
      method: 'POST',
    },
  };
}

export function generateFailedSmsVerifyResponseLessThan3Times(): {
  phase: {
    state: string;
    retryCounter: number;
    fallbackFactorAvailable: boolean;
    previousResult: string;
    securityLevel: string;
    notifications: string[];
  };
  validationUnits: {
    [x: string]: { type: any; id: string; maxSize: number; minSize: number; phoneNumber: string }[];
  }[];
} {
  return {
    phase: {
      state: 'AUTHENTICATION',
      retryCounter: 2,
      fallbackFactorAvailable: false,
      previousResult: 'FAILED_AUTHENTICATION',
      securityLevel: '202',
      notifications: ['otp_sms_invalid'],
    },
    validationUnits: generateSmsValidationUnits(),
  };
}

export function generateLockedSmsVerifyResponseAfter3FailedRetries(): {
  status: string;
  notifications: string[];
  saml2_post: { samlResponse: string; action: string; method: string };
} {
  return {
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
  };
}

export function generateLockedSmsVerifyResponseAfter7FailedRetries(): {
  status: string;
  unlockingDate: string;
  notifications: string[];
  saml2_post: { samlResponse: string; action: string; method: string };
} {
  return {
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
  };
}

export function generateLockedAuthRedirectResponseWhileUserLocked(): {
  status: string;
  saml2_post: { samlResponse: string; action: string; method: string };
} {
  return {
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
  };
}

export function generateLockedAuthRedirectResponseWhileUserLockedPayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  response: { status: string; saml2_post: { samlResponse: string; action: string; method: string } };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
    response: generateLockedAuthRedirectResponseWhileUserLocked(),
  };
}

export function generateLockedSmsVerifyResponseAfter3FailedRetriesPayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  response: {
    status: string;
    notifications: string[];
    saml2_post: { samlResponse: string; action: string; method: string };
  };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
    response: generateLockedSmsVerifyResponseAfter3FailedRetries(),
  };
}

export function generateLockedSmsVerifyResponseAfter7FailedRetriesPayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  response: {
    status: string;
    unlockingDate: string;
    notifications: string[];
    saml2_post: { samlResponse: string; action: string; method: string };
  };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
    response: generateLockedSmsVerifyResponseAfter7FailedRetries(),
  };
}

export function generateRandomBlockedSmsVerifier(
  randomVerifierId: string,
  ruid: string,
): StrongAuthVerifier<{ icgAuthInitResult: { unblockingDate: Date } }> {
  return new StrongAuthVerifier<{ icgAuthInitResult: { unblockingDate: Date } }>({
    verifierId: randomVerifierId,
    metadatas: {
      icgAuthInitResult: {
        responseId: randomVerifierId,
        id: 'd4324b5a-271b-421d-a7dd-5eb63f0a167d',
        method: {
          type: 'SMS',
          id: '4ef28c99-eae9-4359-9b66-665e0113d9a5',
          maxSize: 8,
          minSize: 8,
          phoneNumber: '+3XXXXXXXX00',
        },
        unblockingDate: new Date('2121-03-01T16:44:46.000Z'),
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
      email: `${ruid}@rand.com`,
      uid: ruid,
    },
    channel: Channel.SMS,
    status: AuthStatus.BLOCKED,
    valid: false,
    expirationDate: new Date('2021-03-01T16:44:40.435Z'),
    factor: AuthFactor.OTP,
  });
}

export function generateSmsProviderErrorRedirectResponsePayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  response: { status: string; saml2_post: { samlResponse: string; action: string; method: string } };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
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
}

export function generateGenericFailedAuthRedirectResponsePayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  response: { status: string; saml2_post: { samlResponse: string; action: string; method: string } };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
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
}

export function generateFailedCloudcardVerifyResponseLessThan3TimesPayload(): {
  phase: {
    state: string;
    retryCounter: number;
    fallbackFactorAvailable: boolean;
    previousResult: string;
    securityLevel: string;
  };
  validationUnits: {
    [x: string]: {
      type: string;
      id: string;
      asynchronousWaitingTime: number;
      cloudCardRequestId: string;
      requestTimeToLive: number;
    }[];
  }[];
} {
  return {
    phase: {
      state: 'AUTHENTICATION',
      retryCounter: 2,
      fallbackFactorAvailable: false,
      previousResult: 'FAILED_AUTHENTICATION',
      securityLevel: '202',
    },
    validationUnits: generateCloudcardValidationUnits(),
  };
}

export function generateCloudcardVerifyClearanceRejectedResponsePayload(
  cloudcardVerifierId: string,
): {
  id: string;
  locale: string;
  response: { status: string; saml2_post: { samlResponse: string; action: string; method: string } };
} {
  return {
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
  };
}

export function generateLockedCloudcardVerifyResponseAfter3FailedRetries(): {
  status: string;
  saml2_post: { samlResponse: string; action: string; method: string };
} {
  return {
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
  };
}

export function generateLockedCloudcardVerifyResponseAfter3FailedRetriesPayload(
  randomVerifierId: string,
): RedirectResponsePayloadContextPart & {
  response: { status: string; saml2_post: { samlResponse: string; action: string; method: string } };
} {
  return {
    ...generateAuthInitRedirectResponsePayloadContextPart(randomVerifierId),
    response: generateLockedCloudcardVerifyResponseAfter3FailedRetries(),
  };
}

export async function _setupRandomSmsVerifierWithMetadata(
  randomVerifierId: string,
  randomUser: User,
  verifierRepo: VerifierRepository,
): Promise<void> {
  const smsVerifier = generateRandomSmsVerifierWithMetadata(randomVerifierId, randomUser.props.uid);
  await verifierRepo.save(smsVerifier);
}

export async function _setupRandomSmsVerifierWithMetadataAndUnknownAuthFactor(
  randomVerifierId: string,
  randomUser: User,
  verifierRepo: VerifierRepository,
): Promise<void> {
  const smsVerifier = generateRandomSmsVerifierWithMetadata(randomVerifierId, randomUser.props.uid);
  (smsVerifier.factor as unknown) = 'toto';
  await verifierRepo.save(smsVerifier);
}

export function _setupRandomAuthInitRedirectPath(): { redirectPathname: string; randomVerifierId: string } {
  const randomVerifierId = generateRandomId();
  const redirectPathname = generateRandomRedirectPathname(randomVerifierId);
  return { redirectPathname, randomVerifierId };
}

export function _setupRandomVerifyPath(
  icgVerifyPath: string,
): { randomVerifierId: string; icgAuthVerifyPath: string } {
  const randomVerifierId = generateRandomId();
  const icgAuthVerifyPath = generateRandomAuthVerifyPath(icgVerifyPath, randomVerifierId);
  return { randomVerifierId, icgAuthVerifyPath };
}

export async function _setupRandomUser(userRepo: UserRepository): Promise<User> {
  const randomUser = generateRandomUser();
  await userRepo.save(randomUser);
  return randomUser;
}

export async function _setupCloudVerifierWithMetadata(
  vId: string,
  u: User,
  vRepo: VerifierRepository,
): Promise<void> {
  const cloudcardVerifier = generateRandomCloudcardVerifierWithMetadata(vId, u.props.uid);
  await vRepo.save(cloudcardVerifier);
}

export function _matchSmsAuthRequestPayload(body: AuthRequestPayload) {
  const validationUnitId = Object.keys(body.validate)[0];
  return body.validate[validationUnitId][0].type === ValidationMethodType.SMS;
}

export function _matchCloudcardAuthRequestPayload(body: AuthRequestPayload) {
  const validationUnitId = Object.keys(body.validate)[0];
  return body.validate[validationUnitId][0].type === ValidationMethodType.PIN_AUTH;
}
