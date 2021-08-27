import { ProfileGateway, User } from '@oney/authentication-core';
import { injectable } from 'inversify';
import { ApiProvider } from '@oney/common-core';
import { ServiceApi } from '@oney/common-adapters';

@injectable()
export class UserProfileGateway implements ProfileGateway {
  constructor(private readonly _apiProvider: ApiProvider<ServiceApi>) {}

  async create({ props }: User): Promise<void> {
    const { uid, email, phone } = props;
    await this._apiProvider.api().profile.createProfile({ uid, email: email.address, phone });
  }
}
