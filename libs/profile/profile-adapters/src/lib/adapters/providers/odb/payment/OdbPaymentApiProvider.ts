import { BaseApiProvider } from '@oney/common-adapters';
import { IHttpBuilder } from '@oney/http';
import { injectable } from 'inversify';
import { UserApi } from './api/userApi';

export interface OdbPaymentApis {
  userApi: UserApi;
}

@injectable()
export class OdbPaymentApiProvider extends BaseApiProvider<OdbPaymentApis> {
  private readonly _client: IHttpBuilder;

  constructor(client: IHttpBuilder, apiErrorName: string) {
    super(client, apiErrorName);
    this._client = client;
  }

  api(): OdbPaymentApis {
    return {
      userApi: new UserApi(this._client),
    };
  }
}
