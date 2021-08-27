import { GetSplitContractsResponse, ServiceApi } from '@oney/common-adapters';
import { ApiProvider } from '@oney/common-core';
import { CreditGateway } from '@oney/payment-core';
import { injectable } from 'inversify';

@injectable()
export class OdbCreditGateway implements CreditGateway {
  constructor(private readonly _apiProvider: ApiProvider<ServiceApi>) {}

  async getDetails(uid: string): Promise<GetSplitContractsResponse[]> {
    return this._apiProvider.api().credit.getUserDetails({ uid });
  }
}
