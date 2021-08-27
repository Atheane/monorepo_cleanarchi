/* eslint-disable no-underscore-dangle */
import { Env, KeyVault } from '@oney/env';
import { ISecretEnvs } from './ISecretEnvs';

const shouldUseKeyvault = ['development', 'production'].includes(process.env.NODE_ENV);

@KeyVault(shouldUseKeyvault)
export class SecretEnvs implements ISecretEnvs {
  @Env('AppInsightInstrumentKey')
  appInsightInstrumentKey: string;

  @Env('EventHubConnectionString')
  eventHubConnectionString: string;

  @Env('ServiceBusConnectionString')
  serviceBusConnectionString: string;
}
