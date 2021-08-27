import { Container } from 'inversify';
import { HealthcheckController } from './controllers/HealthcheckController';

export function buildHealthcheckModule(container: Container) {
  container.bind(HealthcheckController).to(HealthcheckController);
}
