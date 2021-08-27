import { MaybeType } from '@oney/common-core';
import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { User } from '../../domain/aggregates/User';
import { HashGateway } from '../../domain/gateways/identity/HashGateway';
import { UserError } from '../../domain/models/AuthenticationError';
import { DefaultDomainErrorMessages } from '../../domain/models/AuthenticationErrorMessage';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { PinCode } from '../../domain/valueobjects/PinCode';
import { AuthIdentifier } from '../AuthIdentifier';
import { HashType } from '../..';

export interface SetPinCodeCommand {
  userId: string;
  pinCode: {
    value: string;
    deviceId: string;
  };
}

@injectable()
export class SetPinCode implements Usecase<SetPinCodeCommand, User> {
  constructor(
    @inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository,
    @inject(AuthIdentifier.hashGateway) private readonly hashGateway: HashGateway,
    @inject(EventProducerDispatcher) private readonly _eventProducerDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: SetPinCodeCommand): Promise<User> {
    const pinCode = new PinCode({ ...request.pinCode, isSet: true }) as Required<PinCode>;
    const maybeUser = await this.userRepository.getById(request.userId);
    if (maybeUser.type === MaybeType.Nothing) {
      throw new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND);
    }
    const user = maybeUser.value;
    const hashed = await this.hashGateway.hash(pinCode.value, HashType.MD5);
    user.trustDevice({ ...pinCode, value: hashed });
    await this.userRepository.save(user);
    await this._eventProducerDispatcher.dispatch(user);
    return user;
  }
}
