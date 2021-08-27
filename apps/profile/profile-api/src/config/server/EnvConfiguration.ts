// eslint-disable-next-line max-classes-per-file
import { Env, KeyVault, Load, Local } from '@oney/envs';

const isProduction = process.env.NODE_ENV === 'production';

@Local()
class AzureAuthConfiguration {
  @Env('PP_DE_REVE_CLIENTID')
  ppDeReve: string;

  @Env('ONEY_COMPTA_CLIENTID')
  oneyCompta: string;
}

@Local()
class FeatureFLagConfiguration {
  @Env('PROFILE_STATUS_SAGA_FEATURE_FLAG')
  profileStatusSaga: boolean;
}

@KeyVault(isProduction)
export class OneyFccFicp {
  @Env('oneyFccFicpApiXAuthAuthent')
  oneyFccFicpApiXAuthAuthent: string;

  @Env('partnerGuid')
  partnerGuid: string;

  @Env('secretKey')
  secretKey: string;

  @Env('apiKey')
  apiKey: string;
}

@KeyVault(isProduction)
export class OneyB2CConfiguration {
  @Env('odbOneyB2CKey')
  odbOneyB2CKey: string;

  @Env('OdbOneyB2CApiXAuthAuthor')
  OdbOneyB2CApiXAuthAuthor: string;

  @Env('odbOneyB2CApiClientSecret')
  odbOneyB2CApiClientSecret: string;

  @Env('odbOneyB2CApiClientId')
  odbOneyB2CApiClientId: string;

  @Env('odbOneyB2CKeyId')
  odbOneyB2CKeyId: string;

  @Env('OdbOneyB2CApiXAuthAuthent')
  OdbOneyB2CApiXAuthAuthent: string;
}

@KeyVault(isProduction)
export class KeyVaultConfiguration {
  @Env('cosmosDbConnectionString')
  mongoDbPath: string;

  @Env('appInsightKey')
  appInsightKey: string;

  @Env('serviceBusConnectionString')
  serviceBusUrl: string;

  @Env('JwtSecret')
  jwtSecret: string;

  @Env('ProfileCdpSubscriptionKey')
  cdpApiKey: string;

  @Env('OneytrustSecretKey')
  otSecretKey: string;

  @Env('OneytrustEntityReference')
  otEntityReference: number;

  @Env('OneytrustLogin')
  otLogin: string;

  @Env('OdbPaymentBasicAuthToken')
  odbPaymentToken: string;

  @Load(OneyB2CConfiguration)
  oneyB2CConfiguration: OneyB2CConfiguration;

  @Load(OneyFccFicp)
  oneyFccFicp: OneyFccFicp;

  @Env('OdbProfileBlobStorageCs')
  odbProfileBlobStorageCs;

  @Env('ApplicationId')
  applicationId: string;
}

@Local()
export class EnvConfiguration {
  @Env('ODB_PROFILE_MONGODB_ACCOUNT_COLLECTION')
  mongoDbCollection: string;

  @Env('OTP_MONGODB_COLLECTION')
  otpMongoDbCollection: string;

  @Env('PORT')
  port: number;

  @Env('ODB_PROFILE_CDP_API_URL')
  cdpApiUrl: string;

  @Env('ONEYTRUST_API_URL')
  otApiUrl: string;

  @Env('AzureAdTenantId')
  azureAdTenantId: string;

  @Env('SERVICE_BUS_SUBSCRIPTION')
  serviceBusSub: string;

  @Env('SERVICE_BUS_TOPIC')
  serviceBusTopic: string;

  @Env('SERVICE_BUS_PROFILE_AZF_TOPIC')
  serviceBusProfileAzfTopic: string;

  @Env('ODB_PAYMENT_TOPIC')
  odbPaymentTopic: string;

  @Env('ODB_SUBSCRIPTION_TOPIC')
  odbSubscriptionTopic: string;

  @Env('USE_APP_INSIGHTS')
  useAppInsights: boolean;

  @Env('ODB_PROFILE_PAYMENT_AZF_EKYC_TOPIC')
  topicPaymentAzfEkyc: string;

  @Env('ODB_AGGREGATION_TOPIC')
  topicOdbAggregation: string;

  @Env('ONEYB2C_API_VERSION')
  oneyB2CapiVersion: string;

  @Env('ONEYB2C_BASE_URL')
  oneyB2CbaseUrl: string;

  @Env('ONEY_FCC_FICP_BASE_URL')
  oneyFccFicpBaseUrl: string;

  @Env('ONEY_B2C_TOKEN_EXPIRATION')
  oneyB2CtokenExpiration: string;

  @Env('ODB_PAYMENT_BASE_URL')
  odbPaymentBaseUrl: string;

  @Env('FRONT_DOOR_BASE_URL')
  frontDoorApiBaseUrl: string;

  @Env('ONEY_TRUST_FOLDER_BASE_API')
  oneyTrustFolderBaseApi: string;

  @Env('ONEYTRUST_CASE_TYPE')
  oneytrustCaseType: number;

  @Env('ONEYTRUST_LANGUAGE')
  oneytrustLanguage: string;

  @Env('ODB_CALLBACK_URL_DECISION_ONEYTRUST')
  callbackDecisionUrl: string;

  @Env('FLAG_ODB_CALLBACK_URL_IN_ONEYTRUST_PAYLOAD')
  flagCallbackUrlInPayload: boolean;

  @Env('OTP_EXPIRATION_TIME_MINUTES')
  otpExpirationTime: number;

  @Env('OTP_MAX_ATTEMPTS')
  otpMaxAttempts: number;

  @Env('OTP_LOCK_DURATION_HOURS')
  otpLockDuration: number;

  @Env('ACTIVATE_GENERIC_OTP')
  activateGenericOtp: boolean;

  @Env('ODB_PROFILE_BLOB_STORAGE_CONTAINER_NAME')
  blobStorageContainerName: string;

  @Env('FEATURE_FLAG_ONEY_FR_CONTRACT')
  oneyContractFeatureFlag: boolean;

  @Load(AzureAuthConfiguration)
  azureAuthConfiguration: AzureAuthConfiguration;

  @Env('ODB_CONTRACT_PATH')
  odbContractPath: string;

  @Env('ODB_CDP_TOPIC')
  odbCdpTopic: string;

  @Env('CDP_TIMEOUT')
  cdpApiTimeout: number;

  @Env('CUSTOMER_SERVICE_TOPICS_VERSION')
  customerServiceTopicsVersion: string;

  @Load(FeatureFLagConfiguration)
  featureFlag: FeatureFLagConfiguration;

  @Env('DOCUMENT_GENERATOR_API_URL')
  documentGeneratorApiUrl: string;
}

export const envConfiguration = EnvConfiguration.prototype;
export const keyVaultConfiguration = KeyVaultConfiguration.prototype;
