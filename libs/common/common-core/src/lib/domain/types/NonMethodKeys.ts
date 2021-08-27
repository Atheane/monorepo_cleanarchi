/**
 * @see https://stackoverflow.com/a/49062616/795245
 */
export type NonMethodKeys<T> = ({
  [P in keyof T]: T[P] extends Function ? never : P;
} & { [x: string]: never })[keyof T];
