import { MaybeType } from '@oney/common-core';
import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { User } from '../../domain/aggregates/User';
import { UserError } from '../../domain/models/AuthenticationError';
import { DefaultDomainErrorMessages } from '../../domain/models/AuthenticationErrorMessage';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { PinCode } from '../../domain/valueobjects/PinCode';
import { AuthIdentifier } from '../AuthIdentifier';

export interface GetUserCommand {
  userId: string;
}

@injectable()
export class GetUser implements Usecase<GetUserCommand, User> {
  constructor(@inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository) {}

  async execute(request: GetUserCommand): Promise<User> {
    const maybeUser = await this.userRepository.getById(request.userId);
    if (maybeUser.type === MaybeType.Nothing)
      throw new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND);
    const user = maybeUser.value;
    const { uid, phone, email, metadata, pinCode } = user.props;
    return new User({ uid, phone, email, pinCode: PinCode.get(pinCode), ...(metadata && { metadata }) });
  }

  async canExecute(identity: Identity): Promise<boolean> {
    // For partner only.
    const scope = identity.roles.find(item => item.scope.name === ServiceName.authentication);
    if (!scope) {
      return false;
    }
    return scope.permissions.read === Authorization.all;
  }
}
