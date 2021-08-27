import { Container } from 'inversify';
import { InvitationMiddleware } from './middlewares/InvitationMiddleware';
import { RegisterController } from './register.controller';

export function buildRegisterModule(container: Container) {
  container.bind(InvitationMiddleware).to(InvitationMiddleware);
  container.bind(RegisterController).to(RegisterController);
}
