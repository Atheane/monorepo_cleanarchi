import 'reflect-metadata';
import { DomainEvent } from './DomainEvent';
import { DomainEventProducer } from './DomainEventProducer';
import { Entity } from './Entity';
import { eventSourceAggregateRootSym } from '../symbols/eventSourceAggregateRootSym';
import { AggregateErrors } from '../models/AggregateErrors';

export abstract class AggregateRoot<T> extends Entity<T> implements DomainEventProducer<any> {
  events: DomainEvent<any>[] = [];
  version = 0;

  getName(): string {
    return this.constructor.name;
  }
  getEvents(): DomainEvent[] {
    return this.events;
  }

  hasEvents(): boolean {
    return this.getEvents().length > 0;
  }

  clearEvents(): void {
    this.events = [];
  }

  loadFromHistory(domainEvents: DomainEvent[]): AggregateRoot<T> {
    domainEvents.forEach(e => this.applyChange(e, false));
    return this;
  }

  /**
   * @deprecated This method will be private in futur release.
   * Please use applyChange instead.
   */
  addDomainEvent<K extends object>(domainEvent: DomainEvent<K>): void {
    const event = Object.assign(domainEvent, {
      metadata: {
        aggregate: this.getName(),
        aggregateId: this.id,
      },
    });
    this.events = [...this.events, event];
  }

  protected applyChange<K extends object>(domainEvent: DomainEvent<K>, isNew = true): void {
    this.applyChangeInternal(domainEvent);
    if (isNew) {
      this.addDomainEvent(domainEvent);
    }
    ++this.version;
  }

  private applyChangeInternal<K extends object>(domainEvent: DomainEvent<K>): void {
    const meta = Reflect.getOwnMetadata(eventSourceAggregateRootSym, this.constructor);
    const handleKey = meta.handlers.get(domainEvent.constructor.name);
    if (!handleKey) {
      throw new AggregateErrors.MissingHandleDecorator(`Missing @Handle decorator for ${handleKey} event`);
    }
    this[handleKey](domainEvent);
  }
}
