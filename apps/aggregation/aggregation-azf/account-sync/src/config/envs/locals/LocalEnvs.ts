/* eslint-disable no-underscore-dangle */
import { Env, Load, Local } from '@oney/env';
import { IAppInsight, IBudgetInsight, IServiceBus, ILocalEnvs } from './ILocalEnvs';

@Local()
export class AppInsight implements IAppInsight {
  @Env('USE_APP_INSIGHTS')
  isActive: boolean;

  @Env('APP_INSIGHT_TRACK_BODIES')
  trackConsoleLogs: boolean;

  @Env('APP_INSIGHT_TRACK_CONSOLE_LOGS')
  trackBodies: boolean;
}

@Local()
export class BudgetInsight implements IBudgetInsight {
  @Env('BUDGET_INSIGHT_BASE_URL')
  baseUrl: string;

  @Env('BUDGET_INSIGHT_CLIENT_ID')
  clientId: string;
}

@Local()
export class ServiceBus implements IServiceBus {
  @Env('SERVICE_BUS_SUBSCRIPTION')
  subscription: string;

  @Env('SERVICE_BUS_TOPIC')
  topic: string;
}

@Local()
export class LocalEnvs implements ILocalEnvs {
  @Load(AppInsight)
  appInsight: AppInsight;

  @Load(BudgetInsight)
  budgetInsight: BudgetInsight;

  @Load(ServiceBus)
  serviceBus: ServiceBus;
}
