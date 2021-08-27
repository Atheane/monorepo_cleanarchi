import { Event } from '../types';

export interface EventRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll(): Promise<Event[]>;
  save(events: Event[]): Promise<Event[]>;
  deleteMany(ids: string[]): Promise<void>;
}
