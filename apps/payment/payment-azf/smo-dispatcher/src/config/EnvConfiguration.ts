// eslint-disable-next-line max-classes-per-file
import { Env, Local, KeyVault } from '@oney/env';

const nonLocalEnv = ['development', 'production'];

export const isLocalConfig = nonLocalEnv.includes(process.env.NODE_ENV);

@Local()
export class EnvConfiguration {
  @Env('DB_COLLECTION')
  mongoDbCollection: string;

  @Env('SMONEY_EKYC_FUNCTION_SERVICE_BUS_SUBSCRIPTION')
  serviceBusSub: string;

  @Env('SMONEY_EKYC_FUNCTION_SERVICE_BUS_TOPIC')
  serviceBusTopic: string;
}

@KeyVault(isLocalConfig)
export class KeyVaultSecrets {
  @Env('ServiceBusConnectionString')
  public serviceBusUrl: string;

  @Env('EventStoreDbConnectionString')
  public eventStoreDbUrl: string;
}

export const envConfiguration = EnvConfiguration.prototype;
export const keyVaultSecrets = KeyVaultSecrets.prototype;
