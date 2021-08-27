import { ServiceApi } from '@oney/common-adapters';
import { ApiProvider } from '@oney/common-core';
import { BankAccountGateway, Profile } from '@oney/profile-core';
import { injectable } from 'inversify';

@injectable()
export class OdbBankAccountGateway implements BankAccountGateway {
  constructor(private readonly _apiProvider: ApiProvider<ServiceApi>) {}

  async create(profile: Profile): Promise<string> {
    return await this._apiProvider.api().payment.createBankAccount({
      uid: profile.props.uid,
      zipCode: profile.props.informations.address.zipCode,
      street: profile.props.informations.address.street,
      additionalStreet: profile.props.informations.address.additionalStreet,
      country: profile.props.informations.address.country,
      city: profile.props.informations.address.city,
    });
  }

  async getId(profile: Profile): Promise<string> {
    return await this._apiProvider.api().payment.getBankAccountId({
      uid: profile.props.uid,
    });
  }
}
