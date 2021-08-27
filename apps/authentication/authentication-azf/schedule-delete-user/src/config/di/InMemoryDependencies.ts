import { Container } from 'inversify';
import { Identifier } from './Identifier';
import { InMemoryUserRepository } from '../../adapters/inmemory/InMemoryUserRepository';
import { UserProperties } from '../../core/domain/entities/User';

export class InMemoryDependencies {
  static initDependencies(container: Container): void {
    container
      .bind<InMemoryUserRepository>(Identifier.userRepository)
      .toConstantValue(new InMemoryUserRepository(new Map<string, UserProperties>()));
  }
}
