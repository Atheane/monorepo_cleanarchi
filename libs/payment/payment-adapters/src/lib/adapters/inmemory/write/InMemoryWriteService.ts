import { WriteService } from '@oney/payment-core';
import { injectable } from 'inversify';

@injectable()
export class InMemoryWriteService implements WriteService {
  constructor(private readonly store: Map<string, any>) {}

  upsert<T>(predicate: { [p: string]: any }, data: T): Promise<T> {
    const key = predicate.uid || predicate.cid || predicate.iban || predicate.orderId;
    this.store.set(key, data);
    return Promise.resolve(data);
  }

  clear?(): Promise<void> {
    return Promise.resolve(this.store.clear());
  }
}
