import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Profile } from '@oney/profile-core';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { Identifiers } from '../../Identifiers';
import { B2BCustomerGateway } from '../../domain/gateways/B2BCustomerGateway';

export type GetCustomerSituationsCommand = { uid: string };

@injectable()
export class GetCustomerSituations implements Usecase<GetCustomerSituationsCommand, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.b2bCustomerGateway) private readonly _oneyB2BCustomerGateway: B2BCustomerGateway,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute({ uid }: GetCustomerSituationsCommand): Promise<Profile> {
    const profile = await this._profileRepositoryRead.getUserById(uid);

    const customerSituations = await this._oneyB2BCustomerGateway.getCustomerSituations(profile.props.uid);

    profile.updateCustomerSituations(customerSituations);

    await this._profileRepositoryWrite.save(profile);

    await this.eventDispatcher.dispatch(profile);

    return profile;
  }
}
