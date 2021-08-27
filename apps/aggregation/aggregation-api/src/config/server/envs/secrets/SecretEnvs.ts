/* eslint-disable no-underscore-dangle */
import { Env, KeyVault } from '@oney/envs';
import { ISecretEnvs } from './ISecretEnvs';

const isProduction = process.env.NODE_ENV === 'production';

@KeyVault(isProduction)
export class SecretEnvs implements ISecretEnvs {
  @Env('appInsightsKey')
  apiKey: string;

  @Env('dbProvider')
  path: string;

  @Env('budgetInsightClientSecret')
  clientSecret: string;

  @Env('webhookToken')
  webHookToken: string;

  @Env('jwtSignatureKey')
  jwtSecret: string;

  @Env('serviceBusConnectionString')
  serviceBusConnectionString: string;

  @Env('algoanClientSecret')
  algoanClientSecret: string;

  @Env('blobStorageConnectionString')
  blobStorageConnectionString: string;

  @Env('azureTenantId')
  azureTenantId: string;

  @Env('algoanResthookId')
  algoanResthookId: string;
}
