export class IAppInsightConfiguration {
  isActive: boolean;
  trackConsoleLogs: boolean;
  trackBodies: boolean;
}

export interface IBudgetInsightConfiguration {
  testConnectorId: string;
  baseUrl: string;
  clientId: string;
  longPolling: ILongPolling;
}

export interface ILongPolling {
  maxAttemps: number;
  interval: number;
}

export class IAlgoanConfiguration {
  baseUrl: string;
  clientId: string;
  longPolling: ILongPolling;
}

export class IServiceBusConfiguration {
  subscription: string;
  aggregationTopic: string;
  authenticationTopic: string;
  paymentTopic: string;
}

export class IBlobStorageConfiguration {
  containerName: string;
  endpoint: string;
  termsVersion: string;
}

export class IPP2ReveConfiguration {
  retryDelay: number;
  maxRetries: number;
}

export interface ILocalEnvs {
  port: number;
  appInsightConfiguration: IAppInsightConfiguration;
  budgetInsightConfiguration: IBudgetInsightConfiguration;
  algoanConfig: IAlgoanConfiguration;
  serviceBus: IServiceBusConfiguration;
  odbApiFrontDoor: string;
  blobStorageConfiguration: IBlobStorageConfiguration;
  pp2reveConfiguration: IPP2ReveConfiguration;
}
