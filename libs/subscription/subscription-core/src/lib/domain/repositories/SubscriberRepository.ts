import { Subscriber } from '../aggregates/Subscriber';

export interface SubscriberRepository {
  save(subscriber: Subscriber): Promise<void>;
  getById(uid: string): Promise<Subscriber>;
  exist(uid: string): Promise<boolean>;
}
