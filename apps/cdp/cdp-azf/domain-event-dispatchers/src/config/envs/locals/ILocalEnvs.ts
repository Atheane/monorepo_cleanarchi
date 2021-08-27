/* eslint-disable no-underscore-dangle */
export class IAppInsight {
  isActive: boolean;
  trackConsoleLogs: boolean;
  trackBodies: boolean;
}

export interface IServiceBus {
  subscription: string;
  topic: string;
}

export interface ILocalEnvs {
  appInsight: IAppInsight;
  serviceBus: IServiceBus;
  eventHubName: string;
}
