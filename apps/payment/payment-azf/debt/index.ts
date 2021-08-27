import 'reflect-metadata';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { ConfigService } from '@oney/env';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import * as path from 'path';
import { Kernel } from './src/bootstrap/Kernel';
import { envConfiguration } from './src/config/EnvConfig';

/**
 * Manage the kernel as a singleton to prevent a new instantiation at each trigger of the AZF.
 * In fact, the AZF context is shared between all the AZF executions, it's better for performances
 * to manage the Kernel as a singleton to prevent the AZF from executing a new database connection
 * at each execution.
 */
let kernel = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debtCallBackHandler: AzureFunction = async (context: Context, req: HttpRequest) => {
  try {
    const { body } = context.req;
    context.log('Received DEBT callback body: ', body);

    if (!kernel) {
      kernel = new Kernel();
      context.log('Load configuration');
      await loadAppConfig();

      context.log('Init dependencies');
      await kernel.initDependencies(envConfiguration);
    }

    const { processDebtCallback } = kernel.getDependencies();

    context.log('Processing SMoney Debt callback');
    await processDebtCallback.execute(body);

    context.res = {
      status: OK,
      body: body,
    };

    context.done();
  } catch (e) {
    context.log('Error happened while processing the callback:', e);
    context.res = {
      status: INTERNAL_SERVER_ERROR,
      error: e.message,
    };
    context.done(e);
  }
};

async function loadAppConfig() {
  const envPath = path.resolve(__dirname + '/local.env'); // We ignore this test case because we dont want to test app in Production mode.
  /* istanbul ignore next */ await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.ODB_PAYMENT_KEY_VAULT_CONNECTION_STRING,
  }).loadEnv();
}

export default debtCallBackHandler;
