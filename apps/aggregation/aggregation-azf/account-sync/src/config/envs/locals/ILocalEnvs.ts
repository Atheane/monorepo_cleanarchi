export class IAppInsight {
  isActive: boolean;
  trackConsoleLogs: boolean;
  trackBodies: boolean;
}

export interface IBudgetInsight {
  baseUrl: string;
  clientId: string;
}

export interface IServiceBus {
  subscription: string;
  topic: string;
}

export interface ILocalEnvs {
  appInsight: IAppInsight;
  budgetInsight: IBudgetInsight;
  serviceBus: IServiceBus;
}
