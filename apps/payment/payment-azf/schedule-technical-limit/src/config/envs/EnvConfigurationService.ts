import { ConfigService } from '@oney/env';

export async function loadingEnvironmentConfig(): Promise<void> {
  await new ConfigService({
    localUri: null,
    keyvaultUri: process.env.ODB_PAYMENT_KEY_VAULT_CONNECTION_STRING,
  }).loadEnv();
}
