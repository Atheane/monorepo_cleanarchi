import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { MaybeType } from '@oney/common-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { AuthIdentifier } from '../AuthIdentifier';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserError, DefaultDomainErrorMessages } from '../..';

export interface BlockUserRequest {
  uid: string;
}

@injectable()
export class BlockUser implements Usecase<BlockUserRequest, void> {
  constructor(
    @inject(AuthIdentifier.userRepository) private readonly userRepository: UserRepository,
    @inject(EventProducerDispatcher) private readonly _eventProducerDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: BlockUserRequest): Promise<void> {
    const maybeUser = await this.userRepository.getById(request.uid);
    if (maybeUser.type === MaybeType.Nothing) {
      throw new UserError.UserNotFound(DefaultDomainErrorMessages.USER_NOT_FOUND);
    }
    const user = maybeUser.value;
    user.block();
    await this.userRepository.save(user);
    return;
  }
}
