import { Container } from 'inversify';
import { DebtsController } from './controllers/DebtsController';

export function buildDebtModule(container: Container) {
  container.bind(DebtsController).toSelf();
}
