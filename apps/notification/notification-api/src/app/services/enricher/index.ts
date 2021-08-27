import { defaultLogger } from '@oney/logger-adapters';
import * as fetchers from '../fetchers';

/**
 * Enrich all the information defined in the configuration using the initial message data
 * @param {Object} message The received Topic message
 * @param {Object} config The notification configuration related to the received message
 * @return {Promise<Object>}
 */
export async function enrich(message, config) {
  defaultLogger.info('enrich=in progress');
  if (!config.enrich || config.enrich.length === 0) {
    return {};
  }

  const enrichedInformations = await Promise.all(config.enrich.map(item => getEnrichedData(message, item)));

  defaultLogger.info('enrich=done');
  return enrichedInformations.reduce((acc: any, item: any) => ({ ...acc, ...item }));
}

/**
 * Get enriched informations for a specific enrich configuration
 * @param {Object} message The received Topic message
 * @param {Object} enrichConfig The configuration of the data to enrich
 * @return {Object}
 */
async function getEnrichedData(message, enrichConfig) {
  const [service, model] = enrichConfig.resource.split('/');

  const res = await fetchers.default[service][model](
    getDeepFields(message, enrichConfig.identifier),
    enrichConfig.fields,
  );

  return { [enrichConfig.as]: res };
}

/**
 * Get deep value from object by passing path to it as string
 * @param {Object} obj The object
 * @param {Object} path The path of the wanted data
 * @return {Object}
 */
function getDeepFields(obj, path) {
  let current = obj;
  path.split('.').forEach(function (p) {
    current = current[p];
  });
  return current;
}
