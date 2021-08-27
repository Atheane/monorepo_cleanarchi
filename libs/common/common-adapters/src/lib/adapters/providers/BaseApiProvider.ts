import { ApiProvider, GenericError } from '@oney/common-core';
import { errorFormatter, IHttpBuilder } from '@oney/http';

export abstract class BaseApiProvider<T> implements ApiProvider<T> {
  public constructor(public readonly http: IHttpBuilder, public readonly apiErrorName: string) {
    http.setResponseInterceptor({
      response(response) {
        return response;
      },
      error(e) {
        // We make sure that sensitive info are not returned in error response.
        const status = e.response ? e.response.status : null;
        const apiErrorReason = e.response ? e.response.data : null;
        if (e.config) delete e.config.headers;
        throw new GenericError.ApiResponseError(apiErrorName, {
          ...errorFormatter(e),
          apiErrorReason,
          status,
        });
      },
    });
  }

  abstract api(): T;
}
