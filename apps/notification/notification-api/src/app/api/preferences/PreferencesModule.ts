import { Container } from 'inversify';
import { PreferencesController } from './preferences.controller';
import { PreferencesDomainErrorMiddleware } from './PreferencesDomainErrorMiddleware';

export function buildPreferencesModule(container: Container): void {
  container.bind(PreferencesDomainErrorMiddleware).to(PreferencesDomainErrorMiddleware);
  container.bind(PreferencesController).to(PreferencesController);
}
