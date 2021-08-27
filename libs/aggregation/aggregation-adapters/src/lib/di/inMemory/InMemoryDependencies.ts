import { Container } from 'inversify';
import {
  AggregationIdentifier,
  BankConnectionProperties,
  BankConnectionRepository,
  UserRepository,
  BankAccountRepository,
  BankAccountProperties,
  UserProperties,
} from '@oney/aggregation-core';
import { InMemoryBankConnectionRepository } from '../../adapters/repositories/inmemory/InMemoryBankConnectionRepository';
import { InMemoryUserRepository } from '../../adapters/repositories/inmemory/InMemoryUserRepository';
import { InMemoryBankAccountRepository } from '../../adapters/repositories/inmemory/InMemoryBankAccountRepository';

export class InMemoryDependencies {
  static initDependencies(container: Container): void {
    container
      .bind<BankConnectionRepository>(AggregationIdentifier.bankConnectionRepository)
      .toConstantValue(new InMemoryBankConnectionRepository(new Map<string, BankConnectionProperties>()));
    container
      .bind<UserRepository>(AggregationIdentifier.userRepository)
      .toConstantValue(new InMemoryUserRepository(new Map<string, UserProperties>()));
    container
      .bind<BankAccountRepository>(AggregationIdentifier.bankAccountRepository)
      .toConstantValue(new InMemoryBankAccountRepository(new Map<string, BankAccountProperties>()));
  }
}
