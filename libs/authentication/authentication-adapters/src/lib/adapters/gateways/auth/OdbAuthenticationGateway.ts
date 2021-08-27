import {
  AuthenticationGateway,
  AuthIdentifier,
  DefaultDomainErrorMessages,
  User,
  UserError,
  UserRepository,
} from '@oney/authentication-core';
import { MaybeType } from '@oney/common-core';
import { inject, injectable } from 'inversify';

@injectable()
export class OdbAuthenticationGateway implements AuthenticationGateway {
  constructor(@inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository) {}

  async signIn(email: string): Promise<User> {
    const maybeUser = await this.userRepository.findByEmail(email);
    if (maybeUser.type === MaybeType.Nothing)
      return Promise.reject(new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND));
    const user = maybeUser.value;
    return user;
  }
}
