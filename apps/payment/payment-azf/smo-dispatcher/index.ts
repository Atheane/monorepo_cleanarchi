import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { ConfigService } from '@oney/env';
import { DispatchHooks } from '@oney/payment-core';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { envConfiguration, keyVaultSecrets } from './src/config/EnvConfiguration';
import { AzfKernel } from './src/core/di/Kernel';

/**
 * Manage the kernel as a singleton to prevent a new instantiation at each trigger of the AZF.
 * In fact, the AZF context is shared between all the AZF executions, it's better for performances
 * to manage the Kernel as a singleton to prevent the AZF from executing a new database connection
 * at each execution.
 */
let container = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    if (!container) {
      await new ConfigService({
        localUri: null,
        keyvaultUri: process.env.ODB_PAYMENT_KEY_VAULT_CONNECTION_STRING,
      }).loadEnv();

      container = await new AzfKernel(envConfiguration, keyVaultSecrets).initDependencies(false);
    }

    const { body, headers } = context.req;
    context.log('Received callback body: ', body);
    context.log('Received callback headers: ', headers);

    context.log({ payload: body });
    await container.get(DispatchHooks).execute({ payload: body });
  } catch (e) {
    context.log('Error happened while processing the callback:', e);
    context.res = {
      status: INTERNAL_SERVER_ERROR,
      error: e.message,
    };
  }
};

export default httpTrigger;
