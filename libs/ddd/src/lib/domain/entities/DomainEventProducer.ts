import { DomainEvent } from './DomainEvent';

export interface DomainEventProducer<T extends object = object> {
  clearEvents(): void;
  addDomainEvent(domainEvent: DomainEvent<T>): void;
  getEvents(): DomainEvent<T>[];
  hasEvents(): boolean;
}
