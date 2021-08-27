import { AxiosHttpMethod, errorFormatter, httpBuilder, IHttpBuilder } from '@oney/http';
import { NetworkError } from '@oney/subscription-core';
import { CacheGateway, TokenType } from '@oney/common-core';
import { SPBGetTokenDetailResponse } from './models/membership/SPBGetTokenDetailResponse';
import { SPBApiConfiguration } from '../../SubscriptionModule';

export async function initSPBHttpClient(
  config: SPBApiConfiguration,
  cacheProvider: CacheGateway,
): Promise<IHttpBuilder> {
  const spbAuthHttpClient = httpBuilder(new AxiosHttpMethod()).setBaseUrl(config.spbAuthApi);
  const spbHttpClient = httpBuilder(new AxiosHttpMethod()).setBaseUrl(config.spbBaseApi);

  // Set the first access_token
  const { accessToken, expireDate } = await getAccessToken(spbAuthHttpClient, config);
  cacheProvider.set(TokenType.ACCESS_TOKEN, accessToken, expireDate);
  spbHttpClient.setAdditionnalHeaders({ Authorization: `Bearer ${accessToken}` }, true);
  // Create action function to be executed on token expiration
  const actionOnExpired = async (key, value) => {
    let accessToken, expireDate;
    try {
      const result = await getAccessToken(spbAuthHttpClient, config);
      accessToken = result.accessToken;
      expireDate = result.expireDate;
      spbHttpClient.setAdditionnalHeaders({ Authorization: `Bearer ${accessToken}` }, true);
    } catch (e) {
      console.log('Error when getting new SPB Access Token', e);
    }
    // We keep the expired token with a TTL=1 to force a retry in case of an S-Money error
    // TTL=0 is not used because it equals to unlimited TTL and so never expire
    cacheProvider.set(key, accessToken || value, expireDate || 1);
  };
  cacheProvider.onExpiration(actionOnExpired);

  return spbHttpClient;
}

async function getAccessToken(
  http: IHttpBuilder,
  configuration: SPBApiConfiguration,
): Promise<Record<string, any>> {
  try {
    const spbAuthConfig = {
      ...configuration,
      password: encodeURIComponent(configuration.password),
    };
    const { data } = await http
      .post<SPBGetTokenDetailResponse>(
        '/auth/realms/spb-api-external/protocol/openid-connect/token',
        `grant_type=${spbAuthConfig.grantType}&client_id=${spbAuthConfig.clientId}&client_secret=${spbAuthConfig.clientSecret}&client_credentials=${spbAuthConfig.clientCredentials}&username=${spbAuthConfig.username}&password=${spbAuthConfig.password}`,
      )
      .execute();
    return { accessToken: data.access_token, expireDate: data.expires_in };
  } catch (e) {
    // We make sure that sensitive info are not returned in error response.
    /* istanbul ignore next : Just a security */
    if (e.config) {
      // delete e.config.data;
    }
    /* istanbul ignore next : Just a security */
    const apiErrorReason = e.response ? e.response.data : null;
    /* istanbul ignore next : Just a security */
    const status = e.response ? e.response.status : null;
    throw new NetworkError.ApiResponseError('SPB_API_ERROR', {
      ...errorFormatter(e),
      apiErrorReason,
      status,
    });
  }
}
