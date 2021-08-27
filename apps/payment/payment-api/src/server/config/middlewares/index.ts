import { Container } from 'inversify';
import { ExpressAuthenticationMiddleware } from '@oney/common-adapters';
import { UserMiddleware } from './UserMiddleware';
import { ScaMiddleware } from './ScaMiddleware';
import { DomainErrorMiddleware } from './DomainErrorsMiddleware';

export function buildMiddleware(container: Container) {
  container.bind(ExpressAuthenticationMiddleware).toSelf();
  container.bind(UserMiddleware).toSelf();
  container.bind(ScaMiddleware).toSelf();
  container.bind(DomainErrorMiddleware).toSelf();
}
