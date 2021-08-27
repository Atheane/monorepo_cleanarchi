import { SecretEnvs } from './SecretEnvs';

export type ISecretEnvs = { [K in keyof SecretEnvs]: SecretEnvs[K] };
