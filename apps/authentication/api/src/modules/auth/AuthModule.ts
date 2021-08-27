import { Container } from 'inversify';
import { AuthController } from './AuthController';
import { EmailAuthenticationMiddleware } from './middlewares/EmailAuthenticationMiddleware';

export function buildAuthModule(container: Container) {
  container.bind(EmailAuthenticationMiddleware).to(EmailAuthenticationMiddleware);
  container.bind(AuthController).to(AuthController);
}
