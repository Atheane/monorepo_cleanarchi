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

export interface IEventHubConfiguration {
  connectionString: string;
  name: string;
}

export class IAzfConfiguration {
  appInsightConfiguration: IAppInsight;
  eventHubConfiguration: IEventHubConfiguration;
  serviceBusConfiguration: IServiceBus;
}
