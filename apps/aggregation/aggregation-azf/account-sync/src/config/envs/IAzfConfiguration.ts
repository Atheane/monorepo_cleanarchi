export interface IAppInsight {
  isActive: boolean;
  trackConsoleLogs: boolean;
  trackBodies: boolean;
  appInsightKey: string;
  appInsightInstrumentKey: string;
}

export interface IBudgetInsight {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
}

export interface IServiceBus {
  connectionString: string;
  subscription: string;
  topic: string;
}

export class IAzfConfiguration {
  appInsightConfiguration: IAppInsight;
  budgetInsightConfiguration: IBudgetInsight;
  serviceBusConfiguration: IServiceBus;
  cosmosDbConnectionString: string;
}
