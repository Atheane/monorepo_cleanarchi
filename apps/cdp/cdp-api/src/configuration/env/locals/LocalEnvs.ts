/* eslint-disable no-underscore-dangle */
import { Env, Local } from '@oney/envs';

@Local()
export class LocalEnvs {
  @Env('NODE_ENV')
  readonly nodeEnv: string;
  @Env('PORT')
  readonly port: number;
  @Env('USE_APP_INSIGHTS')
  readonly useAppInsights: boolean;

  @Env('CDP_TOPIC')
  readonly cdpTopic: string;

  @Env('CDP_SUBSCRIPTION')
  readonly cdpSubscription: string;

  @Env('AGGREGATION_TOPIC')
  readonly aggregationTopic: string;

  @Env('CREDIT_TOPIC')
  readonly creditTopic: string;

  @Env('NOTIFICATION_TOPIC')
  readonly notificationTopic: string;

  @Env('TRANSACTION_TOPIC')
  readonly transactionTopic: string;

  @Env('PAYMENT_TOPIC')
  readonly paymentTopic: string;

  @Env('CARD_LIFECYCLE_FUNCTION_TOPIC')
  readonly cardLifecycleFunctionTopic: string;

  @Env('PAYMENT_AZF_EKYC_TOPIC')
  readonly paymentAzfEkycTopic: string;

  @Env('PROFILE_TOPIC')
  readonly profileTopic: string;

  @Env('PROFILE_AZF_TOPIC')
  readonly profileAzfTopic: string;
}
