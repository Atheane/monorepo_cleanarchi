import { Container } from 'inversify';
import { AuthorizationTokenMiddleware } from '../middlewares/token.middleware';
import { UserMiddleware } from '../middlewares/user.middleware';

export function buildMiddleware(container: Container) {
  container.bind(AuthorizationTokenMiddleware).to(AuthorizationTokenMiddleware);
  container.bind(UserMiddleware).to(UserMiddleware);
}
