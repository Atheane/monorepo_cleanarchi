import { AppConfiguration } from './AppConfiguration';
import { IAppConfiguration } from '../../../../adapters/src/di/app/IAppConfiguration';
import { LocalEnvs } from '../env/locals/LocalEnv';
import { SecretEnvs } from '../env/secrets/SecretEnvs';

export function getAppConfiguration(): IAppConfiguration {
  const localEnvs = new LocalEnvs();
  const secretEnvs = new SecretEnvs();
  return new AppConfiguration(localEnvs, secretEnvs);
}
