import { LocalEnvs } from './LocalEnvs';

export type ILocalEnvs = { [K in keyof LocalEnvs]: LocalEnvs[K] };
