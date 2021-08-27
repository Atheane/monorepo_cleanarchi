import { Context } from '@azure/functions';
import { ConfigService } from '@oney/envs';
import { PayBills } from '@oney/subscription-core';
import * as path from 'path';
import { keyvaultConfiguration, localConfiguration } from './config/EnvConfiguration';
import { SubscriptionKernel } from './config/SubscriptionKernel';

const payBills = async function (context: Context): Promise<void> {
  await new ConfigService({
    /* we don't want to test in production mode */
    localUri:
      process.env.NODE_ENV === 'production'
        ? /* istanbul ignore next */ null
        : path.resolve(__dirname + '/test.env'),
    keyvaultUri: process.env.KEYVAULT_URI,
  }).loadEnv();

  const container = new SubscriptionKernel(localConfiguration, keyvaultConfiguration);
  await container.initDependencies();
  const takeBills = container.get(PayBills);
  await takeBills.execute();
  context.res = {
    status: 'DONE',
  };
};

export default payBills;
