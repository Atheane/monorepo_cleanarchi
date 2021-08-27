import {
  UserRepository,
  BankConnectionRepository,
  AggregationIdentifier,
  BankAccountRepository,
} from '@oney/aggregation-core';
import { Container } from 'inversify';
import { MongoDbBankAccountRepository } from '../../adapters/repositories/mongodb/MongoDbBankAccountRepository';
import { MongoDbBankConnectionRepository } from '../../adapters/repositories/mongodb/MongoDbBankConnectionRepository';
import { MongoDbUserRepository } from '../../adapters/repositories/mongodb/MongoDbUserRepository';

export class RealDependencies {
  static initDependencies(container: Container): void {
    container
      .bind<BankConnectionRepository>(AggregationIdentifier.bankConnectionRepository)
      .toConstantValue(new MongoDbBankConnectionRepository());
    container
      .bind<UserRepository>(AggregationIdentifier.userRepository)
      .toConstantValue(new MongoDbUserRepository());
    container
      .bind<BankAccountRepository>(AggregationIdentifier.bankAccountRepository)
      .toConstantValue(new MongoDbBankAccountRepository());
  }
}
