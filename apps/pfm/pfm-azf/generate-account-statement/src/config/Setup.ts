import { createMongooseConnection, PfmKernel } from '@oney/pfm-adapters';
import { ConfigService } from '@oney/env';
import { AppKernel } from './di/AppKernel';
import { getAppConfiguration } from './envs/EnvConfiguration';

export async function configureEnvs(): Promise<void> {
  await new ConfigService({
    localUri: null,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
}

export async function setupApp(): Promise<PfmKernel> {
  await configureEnvs();
  const envConfiguration = getAppConfiguration();
  const dbConnection = await createMongooseConnection(
    envConfiguration.mongoDbConnectionConfiguration.connectionString,
    envConfiguration.mongoDbConnectionConfiguration.poolSize,
    envConfiguration.mongoDbConnectionConfiguration.maxPoolSize,
  );
  const container = await new AppKernel(envConfiguration, dbConnection).initAppDependencies();

  return container;
}
