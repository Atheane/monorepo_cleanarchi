import { Subscriber, SubscriberErrors, SubscriberRepository } from '@oney/subscription-core';

export class InMemoryOdbSubscriberRepository implements SubscriberRepository {
  constructor(private readonly _store: Map<string, Subscriber>) {}

  async save(subscriber: Subscriber): Promise<void> {
    this._store.set(subscriber.props.uid, subscriber);
    return;
  }

  async getById(uid: string): Promise<Subscriber> {
    const subscriber = this._store.get(uid);
    if (!subscriber) {
      throw new SubscriberErrors.SubscriberNotFound('SUBSCRIBER_NOT_FOUND');
    }
    return subscriber;
  }

  async exist(uid: string): Promise<boolean> {
    return !!this._store.get(uid);
  }
}
