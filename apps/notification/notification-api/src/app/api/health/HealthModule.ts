import { Container } from 'inversify';
import { HealthCheckController } from './health.controller';

export function buildHealthModule(container: Container): void {
  container.bind(HealthCheckController).toSelf();
}
