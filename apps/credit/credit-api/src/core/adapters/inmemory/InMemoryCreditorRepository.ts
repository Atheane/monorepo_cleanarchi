import { injectable } from 'inversify';
import { CreditorProperties, Creditor, CreditorRepository, CreditorError } from '@oney/credit-core';

@injectable()
export class InMemoryCreditorRepository implements CreditorRepository {
  constructor(private store: Map<string, CreditorProperties>) {}

  create(creditorProps: CreditorProperties): Promise<Creditor> {
    const creditorAlreadyExists = this.store.get(creditorProps.userId);
    if (creditorAlreadyExists) {
      throw new CreditorError.AlreadyExists();
    }
    this.store.set(creditorProps.userId, creditorProps);
    return Promise.resolve(Creditor.create(creditorProps));
  }

  findBy(userId: string): Promise<Creditor> {
    const creditor = this.store.get(userId);
    if (!creditor) {
      throw new CreditorError.UserNotFound();
    }
    return Promise.resolve(new Creditor(creditor));
  }

  save(creditorProps: CreditorProperties): Promise<Creditor> {
    this.store.set(creditorProps.userId, creditorProps);
    return this.findBy(creditorProps.userId);
  }
}
