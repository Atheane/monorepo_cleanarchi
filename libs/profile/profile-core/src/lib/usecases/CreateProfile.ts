import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { Profile } from '../domain/aggregates/Profile';
import { DigitalIdentityGateway } from '../domain/gateways/DigitalIdentityGateway';
import { Identifiers } from '../Identifiers';
import { ProfileRepositoryWrite } from '../domain/repositories/write/ProfileRepositoryWrite';

export interface CreateProfileRequest {
  uid: string;
  email: string;
  phone?: string;
}

@injectable()
export class CreateProfile implements Usecase<CreateProfileRequest, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.digitalIdentityGateway)
    private readonly _digitalIdentityGateway: DigitalIdentityGateway,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateProfileRequest): Promise<Profile> {
    const { phone, uid, email } = request;
    const digitalIdentity = await this._digitalIdentityGateway.create(request.email);
    const profile = Profile.createProfile({
      uid,
      email,
      digitalIdentityId: digitalIdentity.props.id,
      phone: phone || digitalIdentity.props.phone,
    });
    await this._profileRepositoryWrite.save(profile);
    await this._eventDispatcher.dispatch(profile);
    return profile;
  }

  async canExecute(identity: Identity): Promise<boolean> {
    const roles = identity.roles.find(role => role.scope.name === ServiceName.profile);
    return roles.permissions.write === Authorization.all || false;
  }
}
