/**
 * @see https://www.typescriptlang.org/v2/docs/handbook/advanced-types.html#example-1
 */
export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
