import { Container } from 'inversify';
import { ResourcesController } from './ResourcesController';

export function buildResourcesModule(container: Container) {
  container.bind(ResourcesController).to(ResourcesController);
}
