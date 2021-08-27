import { MaybeType } from '@oney/common-core';
import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { User } from '../../domain/aggregates/User';
import { HashGateway } from '../../domain/gateways/identity/HashGateway';
import { UserError } from '../../domain/models/AuthenticationError';
import { DefaultDomainErrorMessages } from '../../domain/models/AuthenticationErrorMessage';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthIdentifier } from '../AuthIdentifier';

export interface ClearCodeCommand {
  userId: string;
}

@injectable()
export class CleanPinCode implements Usecase<ClearCodeCommand, User> {
  constructor(
    @inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository,
    @inject(AuthIdentifier.hashGateway) private readonly hashGateway: HashGateway,
    @inject(EventProducerDispatcher) private readonly _eventProducerDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: ClearCodeCommand): Promise<User> {
    const maybeUser = await this.userRepository.getById(request.userId);
    if (maybeUser.type === MaybeType.Nothing)
      throw new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND);
    const user = maybeUser.value;
    user.resetTrustedDevice({ deviceId: user.props.pinCode.deviceId });
    await this.userRepository.save(user);
    await this._eventProducerDispatcher.dispatch(user);
    return user;
  }
}
