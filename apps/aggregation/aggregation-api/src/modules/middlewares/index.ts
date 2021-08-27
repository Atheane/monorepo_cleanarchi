import { Container } from 'inversify';
import { CustomErrorMiddleware } from './CustomErrorMiddleware';
import { DomainErrorMiddleware } from './DomainErrorMiddleware';

export function buildMiddlewares(container: Container): void {
  container.bind(CustomErrorMiddleware).toSelf();
  container.bind(DomainErrorMiddleware).toSelf();
}
