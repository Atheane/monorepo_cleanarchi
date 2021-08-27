import { Container } from 'inversify';
import { HealthcheckController } from './controllers/HealthcheckController';

export function buildHealthcheckModule(container: Container): void {
  container.bind(HealthcheckController).to(HealthcheckController);
}
