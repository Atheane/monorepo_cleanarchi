import { Env, KeyVault } from '@oney/envs';
import { ISecretEnvs } from './ISecretEnvs';

function isAppRunningInProductionEnv() {
  const PRODUCTION_ENV = 'production';
  return process.env.NODE_ENV === PRODUCTION_ENV;
}

@KeyVault(isAppRunningInProductionEnv())
export class SecretEnvs implements ISecretEnvs {
  @Env('dbProvider')
  mongoURI: string;
  @Env('odbPaymentAuthKey')
  odbPaymentAuthKey: string;
  @Env('serviceBusConnectionString')
  serviceBusConnectionString: string;
}
