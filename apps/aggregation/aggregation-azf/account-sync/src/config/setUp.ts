import { ConfigService } from '@oney/env';
import { Connection, createConnection } from 'mongoose';
import { AzfKernel } from './di/AzfKernel';
import { IAzfConfiguration, getAppConfiguration } from './envs';

export const initMongooseConnection = async (config: IAzfConfiguration): Promise<Connection> => {
  // connecting the DB
  const dbConnection = await createConnection(config.cosmosDbConnectionString, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  return dbConnection;
};

/* istanbul ignore next: setUp is done at the beginning of tests, hence not testable */
export const setUp = async (inMemory: boolean, envPath?: string): Promise<AzfKernel> => {
  try {
    await new ConfigService({
      localUri: ['production', 'local'].includes(process.env.NODE_ENV) ? null : envPath,
      keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
    }).loadEnv();

    const config: IAzfConfiguration = getAppConfiguration();
    if (!inMemory) {
      const dbConnection = await initMongooseConnection(config);
      return new AzfKernel(config).initDependencies(dbConnection);
    }
    return new AzfKernel(config).initDependencies();
  } catch (e) {
    console.log(e);
  }
};
