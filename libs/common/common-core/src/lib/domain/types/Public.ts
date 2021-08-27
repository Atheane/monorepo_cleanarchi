/**
 * only picks the public members.
 * @see https://github.com/microsoft/TypeScript/issues/18499#issuecomment-429272545
 */
export type Public<T> = { [P in keyof T]: T[P] };
