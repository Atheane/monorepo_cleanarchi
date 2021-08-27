import { Container } from 'inversify';
import { ClearPinCodeMiddleware } from './middlewares/ClearPinCodeMiddleware';
import { UserController } from './userController';

export function buildUserModule(container: Container) {
  container.bind(ClearPinCodeMiddleware).to(ClearPinCodeMiddleware);
  container.bind(UserController).to(UserController);
}
