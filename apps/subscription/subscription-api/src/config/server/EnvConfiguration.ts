import { Local, Env, KeyVault, Load } from '@oney/envs';
import { SPBConfiguration } from './Configuration';

@KeyVault(process.env.NODE_ENV === 'production')
export class SpbConfig implements SPBConfiguration {
  @Env('spbGrantType')
  grantType: string;

  @Env('spbClientId')
  clientId: string;

  @Env('spbClientSecret')
  clientSecret: string;

  @Env('spbClientCredentials')
  clientCredentials: string;

  @Env('spbUsername')
  username: string;

  @Env('spbPassword')
  password: string;
}

@KeyVault(process.env.NODE_ENV === 'production')
export class KeyvaultConfiguration {
  @Env('serviceBusConnectionString')
  serviceBusUrl: string;

  @Env('cosmosDbConnectionString')
  mongoDbPath: string;

  @Load(SpbConfig)
  spbConfig: SPBConfiguration;
}

@Local()
export class EnvConfiguration {
  @Env('USE_APP_INSIGHT')
  useAppInsights: boolean;

  @Env('APP_INSIGHT_KEY')
  appInsightKey: string;

  @Env('jwtSecret')
  jwtSecret: string;

  @Env('ODB_SUBSCRIPTION_TOPIC')
  odbSubscriptionTopic: string;

  @Env('ODB_SUBSCRIPTION_BUS')
  odbSubscriptionBus: string;

  @Env('ODB_PROFILE_TOPIC')
  odbProfileTopic: string;

  @Env('USE_APP_INSIGHT_CONSOLELOG')
  trackConsoleLog: boolean;

  @Env('USE_APP_INSIGHT_BODYTRACKING')
  trackBodies: boolean;

  @Env('DEFAULT_OFFER')
  defaultOffer: string;

  @Env('ODB_PAYMENT_TOPIC')
  odbPaymentTopic: string;

  @Env('SAGA_DELAY_BEFORE_DISPATCH', { required: false, defaultValue: '0' })
  sagaDelayBeforeDispatch: number;

  @Env('SPB_BASE_API')
  spbBaseApi: string;

  @Env('SPB_AUTH_API')
  spbAuthApi: string;

  @Env('BIN8_MISSING_CHAR')
  bin8MissingChar: string;
}

export const envConfiguration = EnvConfiguration.prototype;
export const keyvaultConfiguration = KeyvaultConfiguration.prototype;
