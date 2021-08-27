import { BaseApiProvider } from '@oney/common-adapters';
import { IHttpBuilder } from '@oney/http';
import { OneyB2BContractApi } from './api/OneyB2BContractApi';
import { OneyB2BCustomerApi } from './api/OneyB2BCustomerApi';

export interface OneyB2BApis {
  contractApi: OneyB2BContractApi;
  customerApi: OneyB2BCustomerApi;
}

export class OneyB2BApiProvider extends BaseApiProvider<OneyB2BApis> {
  constructor(private readonly _client: IHttpBuilder, private readonly _apiErrorName: string) {
    super(_client, _apiErrorName);
  }

  api(): OneyB2BApis {
    return {
      contractApi: new OneyB2BContractApi(this._client),
      customerApi: new OneyB2BCustomerApi(this._client),
    };
  }
}
