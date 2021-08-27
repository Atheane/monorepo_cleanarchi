import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { User } from '../../domain/aggregates/User';
import { IdGenerator } from '../../domain/gateways/IdGenerator';
import { ProfileGateway } from '../../domain/gateways/ProfileGateway';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { PinCode } from '../../domain/valueobjects/PinCode';
import { AuthIdentifier } from '../AuthIdentifier';

export interface RegisterValidateCommand {
  associateProfile: boolean;
  email?: string;
  phone?: string;
  metadata?: Record<any, any>;
  invitationId?: string;
}

@injectable()
export class SignUpUser implements Usecase<RegisterValidateCommand, Promise<User>> {
  constructor(
    @inject(AuthIdentifier.userProfileGateway) private readonly _profileGateway: ProfileGateway,
    @inject(AuthIdentifier.idGenerator) private readonly _idGenerator: IdGenerator,
    @inject(AuthIdentifier.userRepository) private readonly _userRepository: UserRepository,
    @inject(EventProducerDispatcher) private readonly _eventProducerDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: RegisterValidateCommand): Promise<User> {
    const { invitationId, associateProfile, email, metadata, phone } = request;
    const user = User.signUp({
      uid: invitationId || this._idGenerator.generateUniqueID(),
      email,
      phone,
      pinCode: PinCode.get(null),
      metadata,
    });
    if (associateProfile) await this._profileGateway.create(user);
    await this._userRepository.save(user);
    await this._eventProducerDispatcher.dispatch(user);
    return user;
  }

  async canExecute(identity: Identity): Promise<boolean> {
    // For partner only.
    //!TODO Protect the scope with the Profile authorization.
    //!TODO Build an azureAd token with a profile.write.all role.
    const scope = identity.roles.find(item => item.scope.name === ServiceName.authentication);
    if (!scope) {
      return false;
    }
    return scope.permissions.write === Authorization.all;
  }
}
