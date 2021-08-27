/* eslint-disable no-underscore-dangle */
import { Env, Load, Local } from '@oney/env';
import { IAppInsight, IServiceBus, ILocalEnvs } from './ILocalEnvs';

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
export class ServiceBus implements IServiceBus {
  @Env('ODB_CDP_TOPIC')
  topic: string;

  @Env('ODB_CDP_BUS_SUBSCRIPTION')
  subscription: string;
}

@Local()
export class LocalEnvs implements ILocalEnvs {
  @Load(AppInsight)
  appInsight: AppInsight;

  @Load(ServiceBus)
  serviceBus: ServiceBus;

  @Env('EVENT_HUB_NAME')
  eventHubName: string;
}
