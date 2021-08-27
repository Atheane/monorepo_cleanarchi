import { Container } from 'inversify';
import { CustomErrorHandler } from './CustomErrorHandler';
import { ScaAuthorizationTokenMiddleware } from './ScaAuthorizationTokenMiddleware';
import { UserAuthorizationTokenMiddleware } from './UserAuthorizationTokenMiddleware';

export function buildMiddlewares(container: Container) {
  container.bind(CustomErrorHandler).toSelf();
  container.bind(ScaAuthorizationTokenMiddleware).to(ScaAuthorizationTokenMiddleware);
  container.bind(UserAuthorizationTokenMiddleware).to(UserAuthorizationTokenMiddleware);
}
