export interface IAppInsight {
  isActive: boolean;
  trackConsoleLogs: boolean;
  trackBodies: boolean;
  appInsightInstrumentKey: string;
}

export interface IServiceBus {
  connectionString: string;
  subscription: string;
  topic: string;
}

export interface ICosmosDb {
  cosmosDbConnectionString: string;
  dbName: string;
}

export class IAzfConfiguration {
  appInsightConfiguration: IAppInsight;
  serviceBusConfiguration: IServiceBus;
  cosmosDbConfiguration: ICosmosDb;
}
