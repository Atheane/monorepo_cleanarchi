import { GenericError, ApiProvider } from '@oney/common-core';
import { AxiosHttpMethod, errorFormatter, httpBuilder, IHttpBuilder } from '@oney/http';
import { injectable } from 'inversify';
import { SmoneyCardApi } from './smoney/api/SmoneyCardApi';

const httpService = new AxiosHttpMethod();

export interface SmoneyApi {
  smoneyCardApi: SmoneyCardApi;
}

@injectable()
export class SmoneyApiProvider implements ApiProvider<SmoneyApi> {
  private readonly _http: IHttpBuilder;

  constructor(smoneyApiUrl: string, smoneyToken: string) {
    this._http = httpBuilder<AxiosHttpMethod>(httpService)
      .setBaseUrl(smoneyApiUrl)
      .setDefaultHeaders({
        Authorization: `Bearer ${smoneyToken}`,
      })
      .setRequestsConfiguration({
        // need to explicitly set valid response statuses otherwise all are considered valid even error statuses (TODO: @Chalom to investigate)
        validateStatus: status => {
          return status >= 200 && status < 300;
        },
      })
      .setResponseInterceptor({
        response(response) {
          return response;
        },
        error(e) {
          // We make sure that sensitive info are not returned in error response.
          delete e.config.headers;

          /* istanbul ignore next: Just a security */
          const apiErrorReason = e.response ? e.response.data : null;
          throw new GenericError.ApiResponseError('SMONEY_API_ERROR', {
            ...errorFormatter(e),
            apiErrorReason,
            // case when no response from server handled
            status: e.response ? e.response.status : e.code,
          });
        },
      });
  }

  api(): SmoneyApi {
    return {
      smoneyCardApi: new SmoneyCardApi(this._http),
    };
  }
}
