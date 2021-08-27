import {
  IAppConfiguration,
  IAzureBlobStorageConfiguration,
  IMongoConfiguration,
  IAppInsightConfiguration,
  ISmoneyConfig,
  IEventsConfig,
  ITransactionConfig,
  IVault,
} from '@oney/pfm-core';
import { LocalEnvs } from './locals/LocalEnvs';
import { ILocalEnvs } from './locals/ILocalEnvs';
import { ISecretEnvs } from './secrets/ISecretEnvs';
import { SecretEnvs } from './secrets/SecretEnvs';

class AppConfiguration implements IAppConfiguration {
  readonly vault: IVault;
  readonly azureBlobStorageConfiguration: IAzureBlobStorageConfiguration;
  readonly mongoDBEventStoreConfiguration: IMongoConfiguration;
  readonly mongoDBPfmConfiguration: IMongoConfiguration;
  readonly mongoDBTransactionConfiguration: IMongoConfiguration;
  readonly mongoDBAccountConfiguration: IMongoConfiguration;
  readonly appInsightConfiguration: IAppInsightConfiguration;
  readonly smoneyConfig: ISmoneyConfig;
  readonly eventsConfig: IEventsConfig;
  readonly transactionConfig: ITransactionConfig;
  readonly port: string;
  readonly aggregationBaseUrl: string;
  readonly blobStorageEndpoint: string;
  readonly azureAdTenantId: string;
  readonly featureFlagAggregation: boolean;

  constructor(localEnvs: ILocalEnvs, secretEnvs: ISecretEnvs) {
    this.vault = {
      jwtSecret: secretEnvs.jwtSecret,
      cosmosDbConnectionString: secretEnvs.cosmosDbConnectionString,
    };
    this.azureBlobStorageConfiguration = {
      containerName: localEnvs.azureBlobStorageConfiguration.containerName,
      connectionString: secretEnvs.pfmBlobStorageConnectionString,
    };
    this.mongoDBEventStoreConfiguration = {
      name: localEnvs.mongoDBEventStoreConfiguration.name,
    };
    this.mongoDBPfmConfiguration = {
      name: localEnvs.mongoDBPfmConfiguration.name,
    };
    this.mongoDBTransactionConfiguration = {
      name: localEnvs.mongoDBTransactionConfiguration.name,
    };
    this.mongoDBAccountConfiguration = {
      name: localEnvs.mongoDBAccountConfiguration.name,
    };
    this.appInsightConfiguration = {
      apiKey: secretEnvs.apiKey,
      isActive: localEnvs.appInsightConfiguration.isActive,
    };
    this.smoneyConfig = {
      baseUrl: localEnvs.smoneyConfig.baseUrl,
      token: secretEnvs.token,
    };
    this.eventsConfig = {
      paymentTopic: localEnvs.eventsConfig.paymentTopic,
      pfmTopic: localEnvs.eventsConfig.pfmTopic,
      serviceBusSubscription: localEnvs.eventsConfig.serviceBusSubscription,
      serviceBusUrl: secretEnvs.serviceBusUrl,
    };
    this.transactionConfig = {
      baseUrl: localEnvs.transactionConfig.baseUrl,
    };
    this.port = localEnvs.port;
    this.aggregationBaseUrl = localEnvs.aggregationBaseUrl;
    this.blobStorageEndpoint = localEnvs.blobStorageEndpoint;
    this.azureAdTenantId = localEnvs.azureAdTenantId;
    this.featureFlagAggregation = localEnvs.featureFlagAggregation;
  }
}

export function getAppConfiguration(): IAppConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  return new AppConfiguration(localEnvs, secretEnvs);
}
