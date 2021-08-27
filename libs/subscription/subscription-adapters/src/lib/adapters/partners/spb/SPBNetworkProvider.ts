import { errorFormatter, IHttpBuilder } from '@oney/http';
import { injectable } from 'inversify';
import { NetworkError } from '@oney/subscription-core';
import { ApiProvider } from '@oney/common-core';
import { MembershipApi } from './api/MembershipApi';

export interface SPBApis {
  membershipApi: MembershipApi;
}

@injectable()
export class SPBNetworkProvider implements ApiProvider<SPBApis> {
  constructor(private readonly _http: IHttpBuilder) {
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
        const error = new NetworkError.ApiResponseError('SPB_API_ERROR', {
          ...errorFormatter(e),
          apiErrorReason,
          status,
        });
        throw error;
      },
    });
  }

  api(): SPBApis {
    return {
      membershipApi: new MembershipApi(this._http),
    };
  }
}
