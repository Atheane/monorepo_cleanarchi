export interface IMongoConfiguration {
  name: string;
}

export interface IMongoConnectionConfiguration {
  connectionString: string;
  poolSize: number;
  maxPoolSize: number;
}

export interface IAppInsightConfiguration {
  isActive: boolean;
  apiKey: string;
}

export interface ISmoneyConfig {
  baseUrl: string;
  token: string;
}

export interface IEventsConfig {
  generateStatementTopic?: string;
  generatedStatementTopic?: string;
  serviceBusSubscription?: string;
  paymentTopic?: string;
  pfmTopic?: string;
  serviceBusUrl: string;
}

export interface ITransactionConfig {
  baseUrl: string;
}

export interface IAzureBlobStorageConfiguration {
  containerName: string;
  connectionString: string;
}

export interface IVault {
  jwtSecret: string;
  cosmosDbConnectionString?: string; // TODO remove
}

export interface IAppConfiguration {
  vault: IVault;
  azureBlobStorageConfiguration?: IAzureBlobStorageConfiguration;
  mongoDBAccountConfiguration?: IMongoConfiguration;
  mongoDBEventStoreConfiguration?: IMongoConfiguration;
  mongoDBTransactionConfiguration?: IMongoConfiguration;
  mongoDBPfmConfiguration: IMongoConfiguration;
  mongoDbConnectionConfiguration?: IMongoConnectionConfiguration;
  appInsightConfiguration?: IAppInsightConfiguration;
  smoneyConfig: ISmoneyConfig;
  eventsConfig: IEventsConfig;
  transactionConfig?: ITransactionConfig;
  port?: string;
  aggregationBaseUrl?: string;
  // TO-DO remove this duplicate azureBlobStorageConfiguration
  blobStorageEndpoint?: string;
  azureAdTenantId?: string;
  odbFrontDoorUrl?: string;
  featureFlagAggregation?: boolean;
}
