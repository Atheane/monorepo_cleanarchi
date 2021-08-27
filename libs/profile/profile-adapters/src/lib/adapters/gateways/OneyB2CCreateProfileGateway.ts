import { DigitalIdentity, DigitalIdentityGateway, ProfileErrors } from '@oney/profile-core';
import { injectable } from 'inversify';
import { ApiProvider } from '@oney/common-core';
import { OneyCrmApi } from '../providers/oneyB2C/OneyB2CApiProvider';

@injectable()
export class OneyB2CCreateProfileGateway implements DigitalIdentityGateway {
  constructor(private readonly _apiProvider: ApiProvider<OneyCrmApi>) {}

  async create(email: string): Promise<DigitalIdentity> {
    try {
      const digitalIdentity = await this._apiProvider
        .api()
        .oneyB2CAuthenticationApi.getDigitalIdentity(email);
      const phone = digitalIdentity.authentication_factors.find(
        item => item.type === 'PHO' && item.status_code === 'ACT',
      );
      return new DigitalIdentity({
        id: digitalIdentity.identifiers[0].id,
        ...(phone && {
          phone: phone.public_value,
        }),
      });
    } catch (e) {
      if (e instanceof ProfileErrors.ProfileNotFound) {
        return await this.createDigitalIdentity(email);
      }
      throw e;
    }
  }

  private async createDigitalIdentity(email: string): Promise<DigitalIdentity> {
    const result = await this._apiProvider.api().oneyB2CAuthenticationApi.createDigitalIdentity(email);
    return new DigitalIdentity({
      id: result.identifiers[0].id,
    });
  }
}
