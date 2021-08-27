import { WriteService } from '@oney/common-core';
import { injectable } from 'inversify';

@injectable()
export class InMemoryWriteService implements WriteService {
  constructor(private readonly store: Map<string, any>) {}

  insert<T extends { id: string }>(data: T): Promise<T> {
    this.store.set(data.id, data);
    return Promise.resolve(data);
  }

  clear(): Promise<void> {
    return Promise.resolve(this.store.clear());
  }

  deleteOne(id: string): Promise<void> {
    this.store.delete(id);
    return;
  }

  updateOne<T>(id: string, data: T): Promise<T> {
    this.store.set(id, data);
    return Promise.resolve(this.store.get(id));
  }
}
