export interface IAppInsightConfiguration {
  isActive: boolean;
  trackConsoleLogs: boolean;
  trackBodies: boolean;
  apiKey: string;
}

export interface IBudgetInsightConfiguration {
  testConnectorId: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  longPolling: ILongPollingConfiguration;
}

export interface IMongoDBConfiguration {
  uri: string;
}

export interface ILongPollingConfiguration {
  maxAttemps: number;
  interval: number;
}

export interface IAlgoanConfiguration {
  baseUrl: string;
  clientId: string;
  longPolling: ILongPollingConfiguration;
  clientSecret: string;
  restHookId: string;
}

export interface IServiceBus {
  connectionString: string;
  subscription: string;
  aggregationTopic: string;
  authenticationTopic: string;
  paymentTopic: string;
}

export interface IBlobStorageConfiguration {
  connectionString: string;
  containerName: string;
  endpoint: string;
  termsVersion: string;
}

export interface IPP2ReveConfiguration {
  retryDelay: number;
  maxRetries: number;
}

export interface IAppConfiguration {
  appInsightConfiguration: IAppInsightConfiguration;
  budgetInsightConfiguration: IBudgetInsightConfiguration;
  mongoDBConfiguration: IMongoDBConfiguration;
  algoanConfig: IAlgoanConfiguration;
  webHookToken: string;
  jwtSecret: string;
  serviceBus: IServiceBus;
  blobStorageConfiguration: IBlobStorageConfiguration;
  port: number;
  odbApiFrontDoor: string;
  azureTenantId: string;
  pp2reveConfiguration: IPP2ReveConfiguration;
}
