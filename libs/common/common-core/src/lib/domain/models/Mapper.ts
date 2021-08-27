export interface Mapper<T, K = any> {
  toDomain?(raw: K): T;
  fromDomain?(t: T): K;
}
