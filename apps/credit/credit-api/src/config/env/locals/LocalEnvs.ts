/* eslint-disable no-underscore-dangle */
import { Env, Local } from '@oney/envs';
import { ILocalEnvs } from './ILocalEnvs';

@Local()
export class LocalEnvs implements ILocalEnvs {
  @Env('ODB_CREDIT_BUS_SUBSCRIPTION')
  readonly serviceBusSub: string;
  @Env('ODB_CREDIT_TOPIC')
  readonly serviceBusTopic: string;
  @Env('ODB_CREDIT_TERMS_VERSION')
  readonly odbCreditTermsVersion: string;
  @Env('PORT')
  readonly port: number;
  @Env('ODB_PAYMENT_BASE_URL')
  readonly odbPaymentBaseUrl: string;
  @Env('ODB_PAYMENT_MAX_RETRIES')
  readonly odbPaymentMaxRetries: number;
  @Env('ODB_PAYMENT_RETRY_DELAY')
  readonly odbPaymentRetryDelay: number;
  @Env('ODB_CREDIT_BLOB_STORAGE_CONTAINER_NAME')
  readonly containerName: string;
  @Env('SIMULATOR_X3_FEES_RATE')
  readonly x3FeesRate: number;
  @Env('SIMULATOR_X4_FEES_RATE')
  readonly x4FeesRate: number;
  @Env('SIMULATOR_X3_FEES_MAX_THRESHOLD')
  readonly x3SplitFeesMaximumThreshold: number;
  @Env('SIMULATOR_X4_FEES_MAX_THRESHOLD')
  readonly x4SplitFeesMaximumThreshold: number;
  @Env('USE_APP_INSIGHTS')
  readonly useAppInsights: boolean;
  @Env('APP_INSIGHT_TRACK_BODIES')
  readonly appInsightsTrackBodies: boolean;
  @Env('APP_INSIGHT_TRACK_CONSOLE_LOGS')
  readonly appInsightsTrackConsoleLogs: boolean;
  @Env('ODB_CREDIT_DB_NAME')
  readonly odbCreditDbName: string;
  @Env('AZURE_TENANT_ID')
  readonly azureTenantId: string;
  @Env('ONEY_COMPTA_CLIENTID')
  readonly oneyComptaClientId: string;
  @Env('FRONT_DOOR_BASE_URL')
  readonly frontDoorApiBaseUrl: string;
  @Env('ODB_PAYMENT_TOPIC')
  readonly paymentTopic: string;
  @Env('ODB_CDP_TOPIC')
  readonly cdpTopic: string;
}
