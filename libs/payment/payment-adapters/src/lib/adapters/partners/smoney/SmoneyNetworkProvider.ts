import { errorFormatter, IHttpBuilder } from '@oney/http';
import { injectable } from 'inversify';
import { NetworkError, NetworkProvider } from '@oney/payment-core';
import { SmoneyPaymentApi } from './api/SmoneyPaymentApi';
import { SmoneyTransferApi } from './api/SmoneyTransferApi';
import { SmoneyCardApi } from './api/SmoneyCardApi';
import { SmoneyKycApi } from './api/SmoneyKycApi';
import { SmoneyUserApi } from './api/SmoneyUserApi';
import { SmoneyDebtApi } from './api/SmoneyDebtApi';
import { SmoneyAllowanceApi } from './api/SmoneyAllowanceApi';
import { SmoneyOperationApi } from './api/SmoneyOperationApi';
import { SmoneyBankAccountApi } from './api/SmoneyBankAccountApi';
import { SmoneyExposureApi } from './api/SmoneyExposureApi';

export interface SmoneyApi {
  smoneyPaymentApi: SmoneyPaymentApi;
  smoneyTransferApi: SmoneyTransferApi;
  smoneyBankAccountApi: SmoneyBankAccountApi;
  smoneyCardApi: SmoneyCardApi;
  smoneyKycApi: SmoneyKycApi;
  smoneyUserApi: SmoneyUserApi;
  smoneyDebtApi: SmoneyDebtApi;
  smoneyAllowanceApi: SmoneyAllowanceApi;
  smoneyOperationApi: SmoneyOperationApi;
  smoneyExposureApi: SmoneyExposureApi;
}

export interface SmoneyConfiguration {
  getTokenUrl: string;
  clientId: string;
  clientSecret: string;
  grantType: string;
  scope: string;
  baseUrl: string;
  legacyToken: string;
}

@injectable()
export class SmoneyNetworkProvider implements NetworkProvider<SmoneyApi> {
  constructor(private readonly _http: IHttpBuilder, private readonly _bic: string) {
    this._http.setResponseInterceptor({
      response(response) {
        return response;
      },
      error(e) {
        // We make sure that sensitive info are not returned in error response.
        /* istanbul ignore next : Just a security */
        if (e.config) {
          delete e.config.data;
        }
        /* istanbul ignore next : Just a security */
        const apiErrorReason = e.response ? e.response.data : null;
        /* istanbul ignore next : Just a security */
        const status = e.response ? e.response.status : null;
        const error = new NetworkError.ApiResponseError('SMONEY_API_ERROR', {
          ...errorFormatter(e),
          apiErrorReason,
          status,
        });

        throw error;
      },
    });
  }

  api(): SmoneyApi {
    return {
      smoneyPaymentApi: new SmoneyPaymentApi(this._http),
      smoneyTransferApi: new SmoneyTransferApi(this._http),
      smoneyBankAccountApi: new SmoneyBankAccountApi(this._http),
      smoneyCardApi: new SmoneyCardApi(this._http),
      smoneyKycApi: new SmoneyKycApi(this._http),
      smoneyUserApi: new SmoneyUserApi(this._http, this._bic),
      smoneyDebtApi: new SmoneyDebtApi(this._http),
      smoneyAllowanceApi: new SmoneyAllowanceApi(this._http),
      smoneyOperationApi: new SmoneyOperationApi(this._http),
      smoneyExposureApi: new SmoneyExposureApi(this._http),
    };
  }
}
