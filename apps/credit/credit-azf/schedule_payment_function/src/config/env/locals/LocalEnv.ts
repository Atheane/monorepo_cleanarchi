/* eslint-disable no-underscore-dangle */
import { Env, Local } from '@oney/envs';
import { ILocalEnvs } from './ILocalEnvs';

@Local()
export class LocalEnvs implements ILocalEnvs {
  @Env('ODB_PAYMENT_BASE_URL')
  odbPaymentBaseUrl: string;
  @Env('ODB_PAYMENT_RETRY_DELAY')
  odbPaymentRetryDelay: number;
  @Env('ODB_PAYMENT_MAX_RETRIES')
  odbPaymentMaxRetries: number;
  @Env('SCHEDULER_FUNCTION_BUS_SUBSCRIPTION')
  serviceBusSubscription: string;
  @Env('SCHEDULER_FUNCTION_TOPIC')
  serviceBusTopic: string;
}
