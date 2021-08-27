import { Container } from 'inversify';
import { BankConnectionController } from './BankConnectionController';
import { BudgetInsightGuard } from './middlewares';

export function buildBankConnectionModule(container: Container): void {
  container.bind(BankConnectionController).toSelf();
  container.bind(BudgetInsightGuard).toSelf();
}
