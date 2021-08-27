import * as request from 'request-promise-native';
import { config } from '../../../config/config.env';

/**
 * Bank account fetcher, returns all the fields set in the fields parameter for a given bank account
 * @param {String} identifier The user's id
 * @param {[String]} fields The fields to retrieve from the bank account
 * @return {Promise<{}>} The bank account's retrieved field nested under an alias
 */
export function bankaccount(identifier) {
  const client = request.defaults({
    baseUrl: config.accountManagementApiUrl,
    headers: {},
    json: true,
  });

  return client({
    method: 'GET',
    url: `/notification/ressources/bankaccount/${identifier}`,
  });
}
