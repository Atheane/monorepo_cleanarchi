/* eslint-disable no-underscore-dangle */
import { Env, KeyVault } from '@oney/env';
import { ISecretEnvs } from './ISecretEnvs';

const shouldUseKeyvault = ['development', 'production'].includes(process.env.NODE_ENV);

@KeyVault(shouldUseKeyvault)
export class SecretEnvs implements ISecretEnvs {
  @Env('appInsightKeyAzf')
  appInsightKey: string;

  @Env('appInsightInstrumentKeyAzf')
  appInsightInstrumentKey: string;

  @Env('cosmosDbConnectionString')
  cosmosDbConnectionString: string;

  @Env('tokenUrl')
  tokenUrl: string;

  @Env('serviceBusConnectionString')
  serviceBusConnectionString: string;

  @Env('budgetInsightClientSecret')
  budgetInsightClientSecret: string;
}
