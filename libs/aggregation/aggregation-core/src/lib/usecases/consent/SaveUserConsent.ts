import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { User, UserRepository, RbacError } from '../../domain';

export interface SaveUserConsentCommand {
  userId: string;
  consent: boolean;
}

@injectable()
export class SaveUserConsent implements Usecase<SaveUserConsentCommand, User> {
  constructor(
    @inject(AggregationIdentifier.userRepository) private readonly userRepository: UserRepository,
  ) {}

  async canExecute(identity: Identity): Promise<boolean> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.aggregation);
    if (roles.permissions.write !== Authorization.self) {
      throw new RbacError.UserCannotWrite(
        `user ${identity.uid} not allowed to write on ${ServiceName.aggregation}`,
      );
    }
    return true;
  }

  async execute({ userId, consent }: SaveUserConsentCommand): Promise<User> {
    try {
      const existingUser = await this.userRepository.findBy({ userId });
      const consentDate = new Date();
      existingUser.update({ consent, consentDate });
      return this.userRepository.update(existingUser.props.userId, { consent, consentDate });
    } catch (e) {
      // first consent
      const createdUser = User.create({ userId, consent });
      return this.userRepository.create(createdUser.props);
    }
  }
}
