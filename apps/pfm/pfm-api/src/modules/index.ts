import { Container } from 'inversify';
import { buildHealthCheckModule } from './healthcheck';
import { buildUserModule } from './users';

export function buildModules(container: Container): void {
  buildHealthCheckModule(container);
  buildUserModule(container);
}
