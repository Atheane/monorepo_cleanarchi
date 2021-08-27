/**
 * @see https://www.typescriptlang.org/v2/docs/handbook/advanced-types.html#example-1
 */

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K; // eslint-disable-line
}[keyof T];

// export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
export type PublicProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type PartialExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;
