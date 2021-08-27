import { JwtSettings } from './JwtConfiguration';

export interface OdbSignCert {
  odbSignCert: string;
  odbSignCertPass: string;
  caCert: string;
  clientCert: string;
  clientPrivKey: string;
  cardDataDecryptionPrivKey: string;
  cardDataDecryptionPubKey: string;
  icgSamlResponseSignCert: string;
}

export interface DomainConfiguration {
  useIcgSmsAuthFactor: boolean;
  eventConfiguration: {
    subscription: string;
    serviceBusConnectionString: string;
  };

  tokenKeys: {
    oneyFr: string;
  };
  jwt: {
    common: Omit<JwtSettings, 'secret' | 'expiredAt'>;
    auth: {
      secret: string;
      expiredAt: () => number;
    };
    sca: {
      secret: string;
      expiredAt: () => number;
    };
  };

  secretService: OdbSignCert;

  icgConfig: {
    icgBaseUrl: string;
    icgSamlPath: string;
    icgVerifyPath: string;
    odbSigAlgUrl: string;
    icgApplication: string;
    icgContextId: string;
    icgRefAuthBaseUrl: string;
    icgRefAuthPath: string;
    odbCompanyCode: string;
  };

  invitation?: {
    expiryTimeInMinutes: number;
  };

  rejectSelfSignedCerfificateSamlRequest: boolean;

  rejectSelfSignedCerfificateRefauthRequest: boolean;

  profileTopic: string;

  frontDoorApiBaseUrl: string;

  authenticationTopic: string;

  errorNotificationRecipient: string;

  cardLifecycleFunctionTopic: string;

  userTokenExpirationInMinutes: number;

  toggleAuthResponseSignatureVerification: boolean;
}
