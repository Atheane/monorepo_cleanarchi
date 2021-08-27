import { ServiceName } from '@oney/identity-core';
import { AzfKernel } from './di/AzfKernel';
import { getAppConfiguration } from './envs';
import { loadingEnvironmentConfig } from './envs/EnvConfigurationService';

export async function setupApp(): Promise<AzfKernel> {
  await loadingEnvironmentConfig();
  const appConfiguration = getAppConfiguration();
  const kernel = new AzfKernel(false, appConfiguration);
  await kernel.initServiceDependencies({
    jwtOptions: {
      ignoreExpiration: false,
    },
    azureTenantId: '',
    secret: appConfiguration.jwtSecret,
    serviceName: ServiceName.payment,
    applicationId: null,
    azureClientIds: {
      oney_compta: null,
      pp_de_reve: null,
    },
  });
  kernel.initCache();
  kernel.useDb(false);
  kernel.initMessagingPlugin();
  await kernel.initDependencies();

  return kernel;
}
