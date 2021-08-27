import { Env, KeyVault } from '@oney/env';
import { ISecretEnvs } from './ISecretEnvs';

function isAppRunningInProductionEnv() {
  const PRODUCTION_ENV = 'production';
  return process.env.NODE_ENV === PRODUCTION_ENV;
}

@KeyVault(isAppRunningInProductionEnv())
export class SecretEnvs implements ISecretEnvs {
  @Env('cosmosDbConnectionString')
  cosmosDbConnectionString: string;
  @Env('smoneyToken')
  sMoneyToken: string;
  @Env('jwtSignatureKey')
  jwtSignatureKey: string;
  @Env('busConnectionString')
  busConnectionString: string;
}
