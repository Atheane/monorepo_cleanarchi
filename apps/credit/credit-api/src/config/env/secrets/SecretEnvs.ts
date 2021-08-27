import { Env, KeyVault } from '@oney/envs';
import { ISecretEnvs } from './ISecretEnvs';
import { isAppRunningInProductionEnv } from '../EnvConfigurationService';

@KeyVault(isAppRunningInProductionEnv())
export class SecretEnvs implements ISecretEnvs {
  @Env('jwtSignatureKey')
  readonly jwtSignatureKey: string;
  @Env('cosmosDbConnectionString')
  readonly cosmosDbConnectionString: string;
  @Env('appInsightKey')
  readonly appInsightKey: string;
  @Env('odbPaymentAuthKey')
  readonly odbPaymentAuthKey: string;
  @Env('serviceBusConnectionString')
  readonly serviceBusConnectionString: string;
  @Env('storageConnectionString')
  readonly storageConnectionString: string;
  @Env('ApplicationId')
  applicationId: string;
}
