import { BaseApiProvider } from '@oney/common-adapters';
import { IHttpBuilder } from '@oney/http';
import { OneyFccApi } from './api/OneyFccApi';

export class OneyFccApiProvider extends BaseApiProvider<OneyFccApi> {
  constructor(private readonly _client: IHttpBuilder, private readonly _cypherDecipherClient: IHttpBuilder) {
    super(_client, 'ONEY_FCC_API_ERROR');
  }
  api(): OneyFccApi {
    return new OneyFccApi(this._client, this._cypherDecipherClient);
  }
}
