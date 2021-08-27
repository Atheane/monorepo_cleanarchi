import { Container } from 'inversify';
import { CustomErrorMiddleware } from './CustomErrorMiddleware';

export function buildMiddlewares(container: Container) {
  container.bind(CustomErrorMiddleware).toSelf();
}
