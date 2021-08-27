import { ApiProvider } from '@oney/common-core';
import { injectable } from 'inversify';
import { B2BCustomerGateway, CustomerSituations } from '@oney/profile-core';
import { OneyB2BApis } from '../providers/OneyB2B/OneyB2BApiProvider';
import { OneyB2BCustomerResponseMapper } from '../mappers/OneyB2BCustomerResponseMapper';

@injectable()
export class OneyB2BCustomerGateway implements B2BCustomerGateway {
  constructor(
    private readonly _apiProvider: ApiProvider<OneyB2BApis>,
    private readonly _oneyB2BCustomerResponseMapper: OneyB2BCustomerResponseMapper,
  ) {}

  async getCustomerSituations(uid: string): Promise<CustomerSituations> {
    const oneyB2BCustomerApiResponse = await this._apiProvider.api().customerApi.getCustomerSituations(uid);

    const customerSituations = this._oneyB2BCustomerResponseMapper.toDomain(oneyB2BCustomerApiResponse);

    return customerSituations;
  }
}
