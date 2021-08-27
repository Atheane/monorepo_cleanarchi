import { Container } from 'inversify';
import { UserController } from './controllers/UserController';
import { BankAccountMapper } from './mappers/BankAccountMapper';
import { BeneficiaryMapper } from './mappers/BeneficiaryMapper';
import { CardMapper } from './mappers/CardMapper';
import { DebtMapper } from './mappers/DebtMapper';
import { BasicAuthMiddleware } from './middlewares/BasicAuthMiddleware';

export function buildUserModule(container: Container): void {
  container.bind(UserController).toSelf();
  container.bind(BankAccountMapper).toSelf();
  container.bind(CardMapper).toSelf();
  container.bind(DebtMapper).toSelf();
  container.bind(BeneficiaryMapper).toSelf();
  container.bind(BasicAuthMiddleware).toSelf();
}
