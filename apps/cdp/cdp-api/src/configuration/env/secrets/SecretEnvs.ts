import { Env, KeyVault } from '@oney/envs';
import { isAppRunningInProductionEnv } from '../isAppRunningInProductionEnv';

@KeyVault(isAppRunningInProductionEnv())
export class SecretEnvs {
  @Env('AppInsightsKey')
  readonly appInsightsKey: string;

  @Env('ServiceBusConnectionString')
  readonly serviceBusConnectionString: string;
}
