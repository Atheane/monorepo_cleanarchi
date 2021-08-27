import { Env, KeyVault, Load, Local } from '@oney/envs';
import * as moment from 'moment';

const useLocalEnvironment = process.env.NODE_ENV.includes('production');

@Local()
class AzureAuthConfiguration {
  @Env('PP_DE_REVE_CLIENTID')
  ppDeReve: string;
}

@Local()
class IcgConfiguration {
  @Env('IcgApplication')
  icgApplication: string;

  @Env('IcgAuthBaseUrl')
  icgBaseUrl: string;

  @Env('IcgContextId')
  icgContextId: string;

  @Env('IcgRefAuthBaseUrl')
  icgRefAuthBaseUrl: string;

  @Env('IcgRefAuthPath')
  icgRefAuthPath: string;

  @Env('IcgAuthSamlPath')
  icgSamlPath: string;

  @Env('IcgAuthVerifyPath')
  icgVerifyPath: string;

  @Env('OdbCompanyCode')
  odbCompanyCode: string;

  @Env('OdbSigAlgUrl')
  odbSigAlgUrl: string;
}

@KeyVault(useLocalEnvironment)
class AzureBusConfiguration {
  @Env('ServiceBusConnectionString')
  serviceBusConnectionString: string;

  @Env('OdbBusSubscription')
  subscription: string;
}

@KeyVault(useLocalEnvironment)
class IcgCertificateConfiguration {
  @Env('OdbSignCert')
  odbSignCert: string;

  @Env('OdbSignCertPass')
  odbSignCertPass: string;

  @Env('IcgRefAuthCaCert')
  caCert: string;

  @Env('IcgRefAuthClientCert')
  clientCert: string;

  @Env('IcgRefAuthClientPrivKey')
  clientPrivKey: string;

  @Env('CardDataDecryptionPrivKey')
  cardDataDecryptionPrivKey: string;

  @Env('CardDataDecryptionPubKey')
  cardDataDecryptionPubKey: string;

  @Env('IcgSamlResponseSignCert')
  icgSamlResponseSignCert: string;
}

@KeyVault(useLocalEnvironment)
class ScaTokenConfiguration {
  expiredAt = () => {
    const date = moment(new Date());
    const futureDate = moment(date).add(5, 'minutes').toDate();
    return Math.abs(+futureDate - +date);
  };

  @Env('JwtSignatureKey')
  secret: string;
}

@KeyVault(useLocalEnvironment)
class AuthTokenConfiguration {
  expiredAt = (durationInMin: number) => () => {
    const defaultExp = 30;
    let timeToNum = Number(durationInMin);
    const isInvalidExp = !timeToNum;
    const isNotInt = !Number.isInteger(timeToNum);
    const isNegative = timeToNum <= 0;
    if (isInvalidExp || isNotInt || isNegative) timeToNum = defaultExp;
    const date = moment(new Date());
    const userTokenExpiredDate = moment(date).add(timeToNum, 'minutes').toDate();
    return +userTokenExpiredDate;
  };

  @Env('JwtSignatureKey')
  secret: string;
}

@KeyVault(useLocalEnvironment)
class TokenKeysConfiguration {
  @Env('OdbOneyRsaPublicKey')
  oneyFr: string;
}

@KeyVault(useLocalEnvironment)
export class CommonJwtConfiguration {
  @Env('JwtAudience')
  audience: string;

  @Env('JwtIssuer')
  issuer: string;
}

@KeyVault(useLocalEnvironment)
class JwtConfiguration {
  @Load(AuthTokenConfiguration)
  auth: AuthTokenConfiguration;

  @Load(CommonJwtConfiguration)
  common: CommonJwtConfiguration;

  @Load(ScaTokenConfiguration)
  sca: ScaTokenConfiguration;
}

@KeyVault(useLocalEnvironment)
export class AppInsightConfiguration {
  @Env('AppInsightKey')
  appInsightKey: string;
}

@Local()
export class InvitationConfiguration {
  @Env('ExpiryTimeInMinutes')
  expiryTimeInMinutes: number;
}

@Local()
export class LocalEnv {
  @Env('UseAppInsight')
  useAppInsight: boolean;

  @Env('AppInsightTrackBodies')
  appInsightTrackBodies: boolean;

  @Env('AppInsightTrackConsoleLogs')
  appInsightTrackConsoleLogs: boolean;

  @Env('rejectSelfSignedCerfificateSamlRequest')
  rejectSelfSignedCerfificateSamlRequest: boolean;

  @Env('rejectSelfSignedCerfificateRefauthRequest')
  rejectSelfSignedCerfificateRefauthRequest: boolean;

  @Env('IcgSmsAuthFactor')
  useIcgSmsAuthFactor: boolean;

  @Env('ALLOW_PASSWORD_PROVISIONING')
  useExtraProvisionningFeature: boolean;

  @Load(IcgConfiguration)
  icgConfig: IcgConfiguration;

  @Load(AzureAuthConfiguration)
  azureAuthConfiguration: AzureAuthConfiguration;

  @Env('CosmosDbDatabaseName')
  cosmosDbDatabaseName: string;

  @Env('ProfileTopic')
  profileTopic: string;

  @Env('CardLifecycleFunctionTopic')
  cardLifecycleFunctionTopic: string;

  @Env('OdbBusTopic')
  authenticationTopic: string;

  @Env('FrontDoorApiBaseUrl')
  frontDoorApiBaseUrl: string;

  @Env('ErrorNotificationRecipient')
  errorNotificationRecipient: string;

  @Load(InvitationConfiguration)
  invitationConfiguration: InvitationConfiguration;

  @Env('UserTokenExpirationInMinutes')
  userTokenExpirationInMinutes: number;

  @Env('ToggleAuthResponseSignatureVerification')
  toggleAuthResponseSignatureVerification: boolean;
}

@KeyVault(useLocalEnvironment)
export class KeyvaultConfiguration {
  @Load(AzureBusConfiguration)
  eventConfiguration: AzureBusConfiguration;

  @Load(JwtConfiguration)
  jwt: JwtConfiguration;

  @Load(IcgCertificateConfiguration)
  secretService: IcgCertificateConfiguration;

  @Load(TokenKeysConfiguration)
  tokenKeys: TokenKeysConfiguration;

  @Env('CosmosDbConnectionString')
  cosmosDbConnectionString: string;

  @Env('BasicAuthKey')
  basicAuthKey: string;

  @Env('BasicRefAuthKey')
  basicRefAuthKey: string;

  @Env('AuthHealthCheckKey')
  authHealthCheckKey: string;

  @Env('RefAuthHealthCheckKey')
  refAuthHealthCheckKey: string;

  @Env('AzureAdTenantId')
  azureAdTenantId: string;

  @Env('ApplicationId')
  applicationId: string;

  @Load(AppInsightConfiguration)
  appInsightConfiguration: AppInsightConfiguration;
}

export class Envs {
  getKeyvaultSecret() {
    return new KeyvaultConfiguration();
  }

  getLocalVariables() {
    return new LocalEnv();
  }
}

export const envConfiguration = new Envs();
