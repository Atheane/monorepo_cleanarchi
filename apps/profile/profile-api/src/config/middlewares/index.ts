import { Container } from 'inversify';
import { CustomErrorHandler } from './CustomErrorHandler';

export function buildMiddlewares(container: Container): void {
  container.bind(CustomErrorHandler).toSelf();
}
