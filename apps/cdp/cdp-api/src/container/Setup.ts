import { Container } from 'inversify';
import { AppConfiguration } from '../configuration/app/AppConfiguration';

export function SetupContainer(config: AppConfiguration) {
  const container = new Container();

  container.bind(AppConfiguration).toConstantValue(config);

  return container;
}
