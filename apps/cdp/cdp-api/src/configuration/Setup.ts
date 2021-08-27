import { ConfigService } from '@oney/envs';
import { AppConfiguration } from './app/AppConfiguration';
import { isAppRunningInProductionEnv } from './env/isAppRunningInProductionEnv';
import { LocalEnvs } from './env/locals/LocalEnvs';
import { SecretEnvs } from './env/secrets/SecretEnvs';

export let appConfiguration;

export async function setupConfiguration(envPath?: string): Promise<AppConfiguration> {
  const config = new ConfigService({
    localUri: isAppRunningInProductionEnv() ? null : envPath,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  });

  await config.loadEnv();

  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();

  appConfiguration = new AppConfiguration(localEnvs, secretEnvs);

  return appConfiguration;
}
