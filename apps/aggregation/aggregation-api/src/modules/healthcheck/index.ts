import { Container } from 'inversify';
import { HealthCheckController } from './HealthCheckController';

export function buildHealthCheckModule(container: Container): void {
  container.bind(HealthCheckController).toSelf();
}
