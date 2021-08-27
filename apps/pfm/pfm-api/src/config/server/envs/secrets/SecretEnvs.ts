/* eslint-disable no-underscore-dangle */
import { Env, KeyVault } from '@oney/envs';
import { ISecretEnvs } from './ISecretEnvs';

const isProduction = process.env.NODE_ENV === 'production';

@KeyVault(isProduction)
export class SecretEnvs implements ISecretEnvs {
  @Env('appInsightsKey')
  readonly apiKey: string;

  @Env('odbAccountManagementSmoneyToken')
  readonly token: string;

  @Env('serviceBusUrl')
  readonly serviceBusUrl: string;

  @Env('jwtSignatureKey')
  readonly jwtSecret: string;

  @Env('cosmosDbConnectionString')
  readonly cosmosDbConnectionString: string;

  @Env('pfmBlobStorageConnectionString')
  readonly pfmBlobStorageConnectionString: string;
}
