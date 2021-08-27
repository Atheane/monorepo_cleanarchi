import { Event } from './Event';

export interface EventProducer<T extends object = object> {
  clearEvents(): void;
  getEvents(): Event<T>[];
}
