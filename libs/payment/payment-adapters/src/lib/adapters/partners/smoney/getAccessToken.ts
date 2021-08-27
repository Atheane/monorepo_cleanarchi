import { errorFormatter, IHttpBuilder } from '@oney/http';
import { NetworkError } from '@oney/payment-core';
import { SmoneyConfiguration } from './SmoneyNetworkProvider';
import { SmoneyGetTokenDetailResponse } from './models/accessToken/smoneyGetTokenDetailResponse';

export async function getAccessToken(
  http: IHttpBuilder,
  request: SmoneyConfiguration,
): Promise<Record<string, any>> {
  try {
    const { data } = await http
      .post<SmoneyGetTokenDetailResponse>(
        'connect/token',
        `client_id=${request.clientId}&client_secret=${request.clientSecret}&grant_type=${request.grantType}&scope=${request.scope}`,
      )
      .execute();
    return { accessToken: data.access_token, expireDate: data.expires_in };
  } catch (e) {
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
  }
}
