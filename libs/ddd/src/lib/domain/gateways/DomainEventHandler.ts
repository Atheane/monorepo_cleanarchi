import { injectable } from 'inversify';
import { DomainEvent } from '../entities/DomainEvent';

@injectable()
export abstract class DomainEventHandler<T extends DomainEvent = DomainEvent> {
  abstract handle(domainEvent: T): Promise<void>;
}
