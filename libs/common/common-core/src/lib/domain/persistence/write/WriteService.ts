export interface WriteService {
  insert<T extends { id: string }>(data: T): Promise<T>;
  deleteOne(id: string): Promise<void>;
  updateOne<T>(id: string, data: T): Promise<T>;
  clear(): Promise<void>;
}
