// https://stackoverflow.com/questions/57571664/typescript-type-for-an-object-with-only-one-key-no-union-type-allowed-as-a-key

export type OneKey<K extends string, V = any> = {
  [P in K]: Record<P, V> & Partial<Record<Exclude<K, P>, never>> extends infer O
    ? { [Q in keyof O]: O[Q] }
    : never;
}[K];
