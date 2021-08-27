import { Container } from 'inversify';
import { CustomerServiceController } from './CustomerServiceController';

export function buildCustomerServiceModule(container: Container) {
  container.bind(CustomerServiceController).toSelf();
}
