import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { MaybeType } from '@oney/common-core';
import { DefaultDomainErrorMessages, HashType, UserError } from '@oney/authentication-core';
import { User } from '../../domain/aggregates/User';
import { HashGateway } from '../../domain/gateways/identity/HashGateway';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthIdentifier } from '../AuthIdentifier';

export interface SaveUserPasswordRequest {
  userId: string;
  password: string;
}

@injectable()
export class ProvisionUserPassword implements Usecase<SaveUserPasswordRequest, User> {
  constructor(
    @inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository,
    @inject(AuthIdentifier.hashGateway) private readonly hashGateway: HashGateway,
    @inject(EventProducerDispatcher) private readonly _eventProducerDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: SaveUserPasswordRequest): Promise<User> {
    const { password, userId } = request;
    const maybeUser = await this.userRepository.getById(userId);
    if (maybeUser.type === MaybeType.Nothing) {
      throw new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND);
    }
    const user = maybeUser.value;
    const isPasswordValid = user.validatePassword({
      password,
    });
    const hashedPassword = await this.hashGateway.hash(isPasswordValid, HashType.BCRYPT);
    user.createUserPassword({
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    await this._eventProducerDispatcher.dispatch(user);
    return user;
  }
}
