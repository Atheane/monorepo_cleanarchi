export interface Mapper<T, K = object | string> {
  toDomain(raw: K): T | Promise<T>;
  fromDomain?(t: T): K;
}
