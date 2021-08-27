import { injectable } from 'inversify';
import { IHttpBuilder } from '@oney/http';
import { PaymentApi } from './payment/api/PaymentApi';
import { ProfileApi } from './profile/api/ProfileApi';
import { PfmApi } from './pfm/api/PfmApi';
import { CreditApi } from './credit/api/CreditApi';
import { BaseApiProvider } from '../providers/BaseApiProvider';

export interface ServiceApi {
  profile: ProfileApi;
  payment: PaymentApi;
  pfm: PfmApi;
  credit: CreditApi;
}

@injectable()
export class ServiceApiProvider extends BaseApiProvider<ServiceApi> {
  private readonly _http: IHttpBuilder;
  private readonly _apiError: string;
  constructor(http: IHttpBuilder, apiError: string) {
    super(http, apiError);
    this._http = http;
    this._apiError = apiError;
  }

  api(): ServiceApi {
    return {
      profile: new ProfileApi(this._http),
      payment: new PaymentApi(this._http),
      pfm: new PfmApi(this._http),
      credit: new CreditApi(this._http),
    };
  }
}
