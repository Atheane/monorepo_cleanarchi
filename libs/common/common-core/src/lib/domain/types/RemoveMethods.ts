import { NonMethodKeys } from './NonMethodKeys';

export type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>;
