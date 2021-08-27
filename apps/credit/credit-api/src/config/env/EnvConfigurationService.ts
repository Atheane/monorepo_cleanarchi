import { ConfigService } from '@oney/envs';

export function isAppRunningInProductionEnv(): boolean {
  const PRODUCTION_ENV = 'production';
  return process.env.NODE_ENV === PRODUCTION_ENV;
}

export async function loadingEnvironmentConfig(envPath: string = null): Promise<void> {
  await new ConfigService({
    localUri: isAppRunningInProductionEnv() ? null : envPath,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
}
