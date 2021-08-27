/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import { EventRepository } from '../../domain/repositories';
import { Event } from '../../domain/types';

@injectable()
export class InMemoryEventRepository implements EventRepository {
  constructor(private store: Map<Date, Event>) {}

  getAll(): Promise<Event[]> {
    return Promise.resolve([].concat(...this.store.values()));
  }

  save(events: Event[]): Promise<Event[]> {
    events.forEach(event => {
      this.store.set(new Date(), event);
    });
    return Promise.resolve(events);
  }

  async deleteMany(ids: string[]): Promise<void> {
    ids.forEach(id => {
      [...this.store.entries()]
        .filter(([, value]) => value.data.id.toString() === id)
        .forEach(([key]) => this.store.delete(key));
    });
  }
}
