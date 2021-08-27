import { IAppConfiguration } from '@oney/credit-core';
import { AppConfiguration } from './AppConfiguration';
import { LocalEnvs } from '../env/locals/LocalEnvs';
import { SecretEnvs } from '../env/secrets/SecretEnvs';

let appConfiguration: IAppConfiguration = null;
export function getAppConfiguration(): IAppConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  appConfiguration = new AppConfiguration(localEnvs, secretEnvs);
  return appConfiguration;
}
