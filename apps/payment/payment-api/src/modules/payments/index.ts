import { Container } from 'inversify';
import { PaymentController } from './controllers/PaymentController';
import { BasicAuthMiddleware } from './middlewares/BasicAuthMiddleware';

export function buildPaymentModule(container: Container) {
  container.bind(PaymentController).to(PaymentController);
  container.bind(BasicAuthMiddleware).toSelf();
}
