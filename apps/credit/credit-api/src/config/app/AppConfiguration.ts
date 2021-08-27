import {
  IAppConfiguration,
  IAppInsightConfiguration,
  IAzureBlobStorageConfiguration,
  ICalculatorConfiguration,
  IMongoDBConfiguration,
  IOdbCreditBusConfiguration,
  IOdbPaymentConfiguration,
  IEligibilityConfiguration,
} from '@oney/credit-core';
import { ILocalEnvs } from '../env/locals/ILocalEnvs';
import { ISecretEnvs } from '../env/secrets/ISecretEnvs';

export class AppConfiguration implements IAppConfiguration {
  readonly mongoDBConfiguration: IMongoDBConfiguration;
  readonly appInsightConfiguration: IAppInsightConfiguration;
  readonly calculatorConfiguration: ICalculatorConfiguration;
  readonly azureBlobStorageConfiguration: IAzureBlobStorageConfiguration;
  readonly odbPaymentConfiguration: IOdbPaymentConfiguration;
  readonly odbCreditBusConfiguration: IOdbCreditBusConfiguration;
  readonly port: number;
  readonly jwtSignatureKey: string;
  readonly odbCreditTermsVersion: string;
  readonly cosmosDbConnectionString: string;
  readonly appInsightKey: string;
  readonly odbPaymentAuthKey: string;
  readonly azureTenantId: string;
  readonly oneyComptaClientId: string;
  readonly applicationId: string;
  readonly frontDoorApiBaseUrl: string;
  readonly eligibilityConfiguration: IEligibilityConfiguration;

  constructor(private localEnvs: ILocalEnvs, private secretEnvs: ISecretEnvs) {
    this.mongoDBConfiguration = {
      odbCreditDbName: this.localEnvs.odbCreditDbName,
      cosmosDbConnectionString: this.secretEnvs.cosmosDbConnectionString,
    };
    this.appInsightConfiguration = {
      key: this.secretEnvs.appInsightKey,
      use: this.localEnvs.useAppInsights,
      trackBodies: this.localEnvs.appInsightsTrackBodies,
      trackConsoleLogs: this.localEnvs.appInsightsTrackConsoleLogs,
    };
    this.calculatorConfiguration = {
      x3FeesRate: this.localEnvs.x3FeesRate,
      x4FeesRate: this.localEnvs.x4FeesRate,
      x3SplitFeesMaximumThreshold: this.localEnvs.x3SplitFeesMaximumThreshold,
      x4SplitFeesMaximumThreshold: this.localEnvs.x4SplitFeesMaximumThreshold,
    };
    this.azureBlobStorageConfiguration = {
      connectionString: this.secretEnvs.storageConnectionString,
      containerName: this.localEnvs.containerName,
    };
    this.odbPaymentConfiguration = {
      authKey: this.secretEnvs.odbPaymentAuthKey,
      baseUrl: this.localEnvs.odbPaymentBaseUrl,
      maxRetries: this.localEnvs.odbPaymentMaxRetries,
      retryDelay: this.localEnvs.odbPaymentRetryDelay,
      topic: this.localEnvs.paymentTopic,
    };
    this.odbCreditBusConfiguration = {
      connectionString: this.secretEnvs.serviceBusConnectionString,
      topic: this.localEnvs.serviceBusTopic,
      subscription: this.localEnvs.serviceBusSub,
    };
    this.jwtSignatureKey = this.secretEnvs.jwtSignatureKey;
    this.port = this.localEnvs.port;
    this.odbCreditTermsVersion = this.localEnvs.odbCreditTermsVersion;
    this.azureTenantId = this.localEnvs.azureTenantId;
    this.oneyComptaClientId = this.localEnvs.oneyComptaClientId;
    this.applicationId = this.secretEnvs.applicationId;
    this.frontDoorApiBaseUrl = this.localEnvs.frontDoorApiBaseUrl;
    this.eligibilityConfiguration = {
      topic: this.localEnvs.cdpTopic,
    };
  }
}
