export interface IMongoDBConfiguration {
  odbCreditDbName: string;
  cosmosDbConnectionString: string;
}

export interface IAppInsightConfiguration {
  key: string;
  use: boolean;
  trackBodies: boolean;
  trackConsoleLogs: boolean;
}

export interface ICalculatorConfiguration {
  x3FeesRate: number;
  x4FeesRate: number;
  x3SplitFeesMaximumThreshold: number;
  x4SplitFeesMaximumThreshold: number;
}

export interface IAzureBlobStorageConfiguration {
  connectionString: string;
  containerName: string;
}

export interface IOdbPaymentConfiguration {
  authKey: string;
  baseUrl: string;
  maxRetries: number;
  retryDelay: number;
  topic: string;
}
export interface IOdbCreditBusConfiguration {
  connectionString: string;
  topic: string;
  subscription: string;
}

export interface IEligibilityConfiguration {
  topic: string;
}

export interface IAppConfiguration {
  mongoDBConfiguration: IMongoDBConfiguration;
  appInsightConfiguration: IAppInsightConfiguration;
  calculatorConfiguration: ICalculatorConfiguration;
  azureBlobStorageConfiguration: IAzureBlobStorageConfiguration;
  odbPaymentConfiguration: IOdbPaymentConfiguration;
  odbCreditBusConfiguration: IOdbCreditBusConfiguration;
  jwtSignatureKey: string;
  port: number;
  odbCreditTermsVersion: string;
  azureTenantId: string;
  oneyComptaClientId: string;
  applicationId: string;
  frontDoorApiBaseUrl: string;
  eligibilityConfiguration: IEligibilityConfiguration;
}
