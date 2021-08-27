import { Env, KeyVault, Local } from '@oney/env';

const nonLocalEnv = ['development', 'production'];

export const isLocalConfig = nonLocalEnv.includes(process.env.NODE_ENV);

@Local()
export class AzureConfiguration {
  @Env('CARD_LIFECYCLE_FUNCTION_SERVICE_BUS_SUBSCRIPTION')
  public serviceBusSub: string;

  @Env('CARD_LIFECYCLE_FUNCTION_SERVICE_BUS_TOPIC')
  public serviceBusTopic: string;
}

@KeyVault(isLocalConfig)
export class KeyVaultSecrets {
  @Env('ServiceBusConnectionString')
  public serviceBusUrl: string;

  @Env('EventStoreDbConnectionString')
  public eventStoreDbUrl: string;

  @Env('SmoneyApiBaseUrl')
  public smoneyApiBaseUrl: string;

  @Env('SmoneyApiToken')
  public smoneyApiToken: string;

  @Env('OdbAccountManagementPanPub')
  public panPublicKey: string;
}

export const azureConfiguration = AzureConfiguration.prototype;
export const keyVaultSecrets = KeyVaultSecrets.prototype;
