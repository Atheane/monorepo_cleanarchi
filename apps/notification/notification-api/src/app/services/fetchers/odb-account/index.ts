import * as request from 'request-promise-native';
import { config } from '../../../config/config.env';

/**
 * Users fetcher, returns all the fields set in the fields parameter for a given user
 * @param {String} identifier The user's id
 * @param {[String]} fields The fields to retrieve from the user
 * @return {Promise<{}>} The user's retrieved field nested under an alias
 */
export function user(identifier) {
  const client = request.defaults({
    baseUrl: config.accountApiUrl,
    headers: {},
    json: true,
  });

  return client({
    method: 'GET',
    url: `/user/${identifier}`,
  });
}
