import { Container } from 'inversify';
import { Identifier } from './Identifier';
import { InMemoryBankConnectionRepository, InMemoryEventRepository } from '../../core/adapters/inmemory';
import { BankConnection } from '../../core/domain/entities';
import { BankConnectionRepository, EventRepository } from '../../core/domain/repositories';
import { Event } from '../../core/domain/types';

export class InMemoryDependencies {
  static initDependencies(container: Container): void {
    container
      .bind<BankConnectionRepository>(Identifier.bankConnectionRepository)
      .toConstantValue(new InMemoryBankConnectionRepository(new Map<string, BankConnection>()));
    container
      .bind<EventRepository>(Identifier.eventRepository)
      .toConstantValue(new InMemoryEventRepository(new Map<Date, Event>()));
  }
}
