import { Container } from 'inversify';
import { AuthController } from './AuthController';

export function buildAuthModule(container: Container): void {
  container.bind(AuthController).toSelf();
}
