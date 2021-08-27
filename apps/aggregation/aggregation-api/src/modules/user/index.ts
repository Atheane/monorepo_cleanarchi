import { Container } from 'inversify';
import { UserController } from './UserController';
import { BankAccountMapper } from './mappers/BankAccountMapper';
import { BankConnectionMapper } from './mappers/BankConnectionMapper';
import { PP2ReveTransactionMapper } from './mappers/PP2ReveTransactionMapper';
import { TransactionMapper } from './mappers/TransactionMapper';
import { UserMapper } from './mappers/UserMapper';
import { UserMiddleware } from './middlewares';

export function buildUserModule(container: Container): void {
  container.bind(UserMiddleware).toSelf();
  container.bind(UserController).toSelf();
  container.bind(BankAccountMapper).toSelf();
  container.bind(BankConnectionMapper).toSelf();
  container.bind(PP2ReveTransactionMapper).toSelf();
  container.bind(TransactionMapper).toSelf();
  container.bind(UserMapper).toSelf();
}
