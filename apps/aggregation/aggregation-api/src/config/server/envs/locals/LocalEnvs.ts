/* eslint-disable no-underscore-dangle */
import { Env, Load, Local } from '@oney/envs';
import {
  IAppInsightConfiguration,
  IBudgetInsightConfiguration,
  ILongPolling,
  IAlgoanConfiguration,
  ILocalEnvs,
  IServiceBusConfiguration,
  IBlobStorageConfiguration,
  IPP2ReveConfiguration,
} from './ILocalEnvs';

@Local()
export class AppInsightConfiguration implements IAppInsightConfiguration {
  @Env('USE_APP_INSIGHTS')
  isActive: boolean;

  @Env('APP_INSIGHT_TRACK_BODIES')
  trackConsoleLogs: boolean;

  @Env('APP_INSIGHT_TRACK_CONSOLE_LOGS')
  trackBodies: boolean;
}

@Local()
export class LongPolling implements ILongPolling {
  @Env('LONG_POLLING_MAX_ATTEMPS')
  maxAttemps: number;

  @Env('LONG_POLLING_INTERVAL')
  interval: number;
}

@Local()
export class BudgetInsightConfiguration implements IBudgetInsightConfiguration {
  @Env('BUDGET_INSIGHT_TEST_CONNECTOR_ID')
  testConnectorId: string;

  @Env('BUDGET_INSIGHT_BASE_URL')
  baseUrl: string;

  @Env('BUDGET_INSIGHT_CLIENT_ID')
  clientId: string;

  @Load(LongPolling)
  longPolling: LongPolling;
}

@Local()
export class AlgoanConfiguration implements IAlgoanConfiguration {
  @Env('ALGOAN_BASE_URL')
  baseUrl: string;

  @Env('ALGOAN_CLIENT_ID')
  clientId: string;

  @Load(LongPolling)
  longPolling: LongPolling;
}

@Local()
export class ServiceBusConfiguration implements IServiceBusConfiguration {
  @Env('SERVICE_BUS_SUBSCRIPTION')
  subscription: string;
  @Env('SERVICE_BUS_TOPIC_AGGREGATION')
  aggregationTopic: string;
  @Env('SERVICE_BUS_TOPIC_AUTHENTICATION')
  authenticationTopic: string;
  @Env('SERVICE_BUS_TOPIC_PAYMENT')
  paymentTopic: string;
}

@Local()
export class BlobStorageConfiguration implements IBlobStorageConfiguration {
  @Env('BLOB_STORAGE_CONTAINER_NAME')
  containerName: string;
  @Env('BLOB_STORAGE_ENDPOINT')
  endpoint: string;
  @Env('TERMS_VERSION')
  termsVersion: string;
}

@Local()
export class PP2ReveConfiguration implements IPP2ReveConfiguration {
  @Env('PP2REVE_RETRY_DELAY')
  retryDelay: number;
  @Env('PP2REVE_MAX_RETRIES')
  maxRetries: number;
}

@Local()
export class LocalEnvs implements ILocalEnvs {
  @Env('PORT')
  port: number;

  @Env('ODB_API_FRONTDOOR')
  odbApiFrontDoor: string;

  @Load(AppInsightConfiguration)
  appInsightConfiguration: AppInsightConfiguration;

  @Load(BudgetInsightConfiguration)
  budgetInsightConfiguration: BudgetInsightConfiguration;

  @Load(AlgoanConfiguration)
  algoanConfig: AlgoanConfiguration;

  @Load(ServiceBusConfiguration)
  serviceBus: ServiceBusConfiguration;

  @Load(BlobStorageConfiguration)
  blobStorageConfiguration: BlobStorageConfiguration;

  @Load(PP2ReveConfiguration)
  pp2reveConfiguration: PP2ReveConfiguration;
}
