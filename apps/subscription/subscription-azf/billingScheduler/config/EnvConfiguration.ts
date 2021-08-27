import { Env, KeyVault, Local } from '@oney/envs';

@Local()
export class LocalConfiguration {
  @Env('ODB_SUBSCRIPTION_TOPIC')
  odbSubscriptionTopic: string;

  @Env('ODB_SUBSCRIPTION_BUS')
  odbSubscriptionBus: string;
}

@KeyVault(process.env.NODE_ENV === 'production')
export class KeyvaultConfiguration {
  @Env('serviceBusConnectionString')
  serviceBusUrl: string;

  @Env('cosmosDbConnectionString')
  mongoDbPath: string;
}

export const localConfiguration = LocalConfiguration.prototype;
export const keyvaultConfiguration = KeyvaultConfiguration.prototype;
