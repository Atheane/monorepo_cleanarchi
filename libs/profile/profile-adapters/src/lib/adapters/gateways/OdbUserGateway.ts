import { ApiProvider } from '@oney/common-core';
import { UserGateway, Profile } from '@oney/profile-core';
import { injectable } from 'inversify';
import { OdbUserUpdateMapper } from '../mappers/OdbUserUpdateMapper';
import { OdbPaymentApis } from '../providers/odb/payment/OdbPaymentApiProvider';

@injectable()
export class OdbUserGateway implements UserGateway {
  constructor(
    private readonly _apiProvider: ApiProvider<OdbPaymentApis>,
    private readonly _odbUserUpdateMapper: OdbUserUpdateMapper,
  ) {}

  async update(profile: Profile): Promise<Profile> {
    await this._apiProvider.api().userApi.updateUser(this._odbUserUpdateMapper.fromDomain(profile));
    return profile;
  }
}
