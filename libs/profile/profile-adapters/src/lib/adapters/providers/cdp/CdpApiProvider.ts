import { BaseApiProvider } from '@oney/common-adapters';
import { IHttpBuilder } from '@oney/http';
import { injectable } from 'inversify';
import { TipsApi } from './tips/TipsApi';

export interface CdpApi {
  tipsApi: TipsApi;
}

@injectable()
export class CdpApiProvider extends BaseApiProvider<CdpApi> {
  private readonly _client: IHttpBuilder;

  constructor(client: IHttpBuilder, apiErrorName: string) {
    super(client, apiErrorName);
    this._client = client;
  }

  api(): CdpApi {
    return {
      tipsApi: new TipsApi(this._client),
    };
  }
}
