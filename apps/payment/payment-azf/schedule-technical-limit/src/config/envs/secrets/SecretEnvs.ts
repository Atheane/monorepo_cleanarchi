/* eslint-disable no-underscore-dangle */
import { Env, KeyVault } from '@oney/env';
import { ISecretEnvs } from './ISecretEnvs';

const shouldUseKeyvault = process.env.NODE_ENV === 'production';

@KeyVault(shouldUseKeyvault)
export class SecretEnvs implements ISecretEnvs {
  @Env('CosmosDbConnectionString')
  cosmosDbConnectionString: string;

  @Env('ServiceBusConnectionString')
  serviceBusConnectionString: string;

  @Env('smoneyBic')
  smoneyBic: string;

  @Env('smoneyStsConnectUrl')
  getTokenUrl: string;

  @Env('smoneyStsClientId')
  clientId: string;

  @Env('smoneyStsClientSecret')
  clientSecret: string;

  @Env('smoneyStsGrantType')
  grantType: string;

  @Env('smoneyStsScope')
  scope: string;

  @Env('SmoneyApiBaseUrl')
  baseUrl: string;

  @Env('SmoneyApiToken')
  legacyToken: string;

  @Env('jwtSecret')
  jwtSecret: string;
}
