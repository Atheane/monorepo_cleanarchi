import { Usecase } from '@oney/ddd';
import { Identity } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../Identifiers';
import { Profile } from '../../domain/aggregates/Profile';
import { BankAccountGateway } from '../../domain/gateways/BankAccountGateway';
import { CustomerGateway } from '../../domain/gateways/CustomerGateway';
import { FolderGateway } from '../../domain/gateways/FolderGateway';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';

export interface AddressStepRequest {
  street: string;
  additionalStreet?: string;
  postalCode: string;
  city: string;
  country: string;
}

@injectable()
export class AddressStep implements Usecase<AddressStepRequest, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.customerGateway) private readonly _customerGateway: CustomerGateway,
    @inject(Identifiers.bankAccountGateway)
    private readonly _bankAccountGateway: BankAccountGateway,
    @inject(Identifiers.folderGateway) private readonly _updateFolderGateway: FolderGateway,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: AddressStepRequest, identity: Identity): Promise<Profile> {
    const profile = await this.profileRepositoryRead.getUserById(identity.uid);

    const updatedProfile = profile
      .updateProfile({
        uid: profile.props.uid,
        informations: {
          ...profile.props.informations,
          address: {
            country: request.country,
            street: request.street,
            additionalStreet: request.additionalStreet,
            zipCode: request.postalCode,
            city: request.city,
          },
        },
        ipAddress: identity.ipAddress,
      })
      .addressStep();
    await this._updateFolderGateway.update(updatedProfile);
    await this._customerGateway.update(updatedProfile);
    await this._bankAccountGateway.create(updatedProfile);
    await this._profileRepositoryWrite.save(updatedProfile);
    await this.eventDispatcher.dispatch(updatedProfile);
    return updatedProfile;
  }
}
