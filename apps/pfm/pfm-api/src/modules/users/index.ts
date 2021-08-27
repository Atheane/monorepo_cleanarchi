import { Container } from 'inversify';
import { BankAccountMapper } from './mappers/BankAccountMapper';
import { TransactionMapper } from './mappers/TransactionMapper';
import { UserController } from './UserController';
import { UserDomainErrorMiddleware, UserMiddleware } from './middlewares';

export function buildUserModule(container: Container): void {
  container.bind(UserDomainErrorMiddleware).toSelf();
  container.bind(UserMiddleware).toSelf();
  container.bind(UserController).toSelf();
  container.bind(BankAccountMapper).toSelf();
  container.bind(TransactionMapper).toSelf();
}
