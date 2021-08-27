import { Container } from 'inversify';
import { HealthCheckController } from './HealthCheckController';

export function buildHealthCheckModule(container: Container) {
  container.bind(HealthCheckController).to(HealthCheckController);
}
