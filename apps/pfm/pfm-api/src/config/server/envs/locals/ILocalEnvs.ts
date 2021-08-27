/* eslint-disable no-underscore-dangle */
export interface IAppInsightConfiguration {
  isActive: boolean;
}

export interface ISmoneyConfig {
  baseUrl: string;
}

export interface IEventsConfig {
  serviceBusSubscription: string;

  paymentTopic: string;

  pfmTopic: string;
}

export interface ITransactionConfig {
  baseUrl: string;
}

export interface IAzureBlobStorageConfiguration {
  containerName: string;
}
export interface IMongoDBConfiguration {
  name: string;
}

export interface ILocalEnvs {
  azureBlobStorageConfiguration: IAzureBlobStorageConfiguration;
  appInsightConfiguration: IAppInsightConfiguration;
  smoneyConfig: ISmoneyConfig;
  eventsConfig: IEventsConfig;
  transactionConfig: ITransactionConfig;
  mongoDBPfmConfiguration: IMongoDBConfiguration;
  mongoDBTransactionConfiguration: IMongoDBConfiguration;
  mongoDBEventStoreConfiguration: IMongoDBConfiguration;
  mongoDBAccountConfiguration: IMongoDBConfiguration;
  port: string;
  aggregationBaseUrl: string;
  blobStorageEndpoint: string;
  azureAdTenantId: string;
  featureFlagAggregation: boolean;
}
