export interface QueryService {
  findOne<T>(predicate: { [key: string]: unknown }): Promise<T>;
  find<T>(predicate: { [key: string]: unknown }): Promise<T[]>;
}
