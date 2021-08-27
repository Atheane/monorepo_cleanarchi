import { Container } from 'inversify';
import { CreditProfileController } from './CreditProfileController';
import { AlgoanGuard } from './middlewares';

export function buildCreditProfileModule(container: Container): void {
  container.bind(CreditProfileController).toSelf();
  container.bind(AlgoanGuard).toSelf();
}
