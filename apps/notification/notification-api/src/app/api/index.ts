import { Container } from 'inversify';
import { buildHealthModule } from './health/HealthModule';
import { buildPreferencesModule } from './preferences/PreferencesModule';

export function buildModules(container: Container): void {
  buildPreferencesModule(container);
  buildHealthModule(container);
}
