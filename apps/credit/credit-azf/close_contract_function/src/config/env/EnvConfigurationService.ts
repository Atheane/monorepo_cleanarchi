import { ConfigService } from '@oney/envs';

export async function loadingEnvironmentConfig(): Promise<void> {
  await new ConfigService({
    localUri: null,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
}
