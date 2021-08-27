import { initMongooseConnection } from '@oney/common-adapters';
import { getAppConfiguration } from './app/AppConfigurationService';
import { loadingEnvironmentConfig } from './env/EnvConfigurationService';
import { IAppConfiguration } from '../../../adapters/src/di/app';
import { Kernel } from '../../../adapters/src';

export async function setupApp(): Promise<Kernel> {
  await loadingEnvironmentConfig();
  const appConfiguration = getAppConfiguration();
  const kernel = new Kernel(false, appConfiguration);
  kernel.initDependencies();
  await setupServices(appConfiguration);
  return kernel;
}

async function setupServices(appConfig: IAppConfiguration) {
  await initMongooseConnection(appConfig.mongoURI);
}
