import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { User, UserRepository, RbacError } from '../../domain';

export interface CheckUserConsentCommand {
  userId: string;
}

@injectable()
export class CheckUserConsent implements Usecase<CheckUserConsentCommand, User> {
  constructor(
    @inject(AggregationIdentifier.userRepository) private readonly userRepository: UserRepository,
  ) {}

  async canExecute(identity: Identity): Promise<boolean> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.aggregation);
    if (roles.permissions.read !== Authorization.self) {
      throw new RbacError.UserCannotRead(
        `user ${identity.uid} not allowed to read on ${ServiceName.aggregation}`,
      );
    }
    return true;
  }

  async execute({ userId }: CheckUserConsentCommand): Promise<User> {
    return this.userRepository.findBy({ userId });
  }
}
