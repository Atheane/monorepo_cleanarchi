import { BaseApiProvider } from '@oney/common-adapters';
import { IHttpBuilder } from '@oney/http';
import { OneyFicpApi } from './api/OneyFicpApi';

export class OneyFicpApiProvider extends BaseApiProvider<OneyFicpApi> {
  constructor(private readonly _client: IHttpBuilder, private readonly _cypherDecipherClient: IHttpBuilder) {
    super(_client, 'ONEY_FICP_API_ERROR');
  }

  api(): OneyFicpApi {
    return new OneyFicpApi(this._client, this._cypherDecipherClient);
  }
}
