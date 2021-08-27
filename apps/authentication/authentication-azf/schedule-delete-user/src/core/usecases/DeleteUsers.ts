import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Identifier } from '../../config/di';
import { UserRepository } from '../domain/repositories/UserRepository';
import { User } from '../domain/entities/User';
import { UserProviderMetadatas } from '../domain/types/UserProviderMetadatas';

interface DeleteUsersByProviderCommand {
  predicate: UserProviderMetadatas;
}

@injectable()
export class DeleteUsers implements Usecase<DeleteUsersByProviderCommand, User[]> {
  constructor(
    @inject(Identifier.userRepository) private readonly userRepository: UserRepository,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: DeleteUsersByProviderCommand): Promise<User[]> {
    const { predicate } = request;
    const users = await this.userRepository.deleteMany(predicate);
    for (const user of users) {
      user.delete();

      // todo fix me batch all events from this for each
      await this.eventDispatcher.dispatch(user);
    }
    return users;
  }
}
