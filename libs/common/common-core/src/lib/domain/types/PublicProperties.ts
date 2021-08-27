// export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
import { NonFunctionPropertyNames } from './NonFunctionPropertyNames';

export type PublicProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
