export interface WriteService {
  upsert<T>(predicate: { [p: string]: unknown }, data: T): Promise<T>;
  clear?(): Promise<void>;
}
