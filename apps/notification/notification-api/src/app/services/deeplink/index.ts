import { defaultLogger } from '@oney/logger-adapters';
import * as url from 'url';
import { firebaseHttpClient } from './config';

/**
 * @param {Object} payload
 * @param {Object} notification
 * @return {Promise<Object>}
 */
export async function getDeeplinks(payload, notification, { frontDoorURL, firebaseConfig }) {
  defaultLogger.info('get_deep_links=in progress');
  const deeplinksConfig = notification.deeplinks;
  const deeplinksPromises = [];
  const deeplinks = {};

  // eslint-disable-next-line guard-for-in
  for (const name in deeplinksConfig) {
    deeplinksPromises.push(
      generateDeeplink(notification.deeplinks[name](payload), frontDoorURL, firebaseConfig),
    );
  }

  const res = await Promise.all(deeplinksPromises);
  let i = 0;
  // eslint-disable-next-line guard-for-in
  for (const name in deeplinksConfig) {
    deeplinks[name] = res[i];
    i++;
  }
  defaultLogger.info('get_deep_links=done');

  return deeplinks;
}

/**
 * @param {string} link
 * @param {string} frontDoorURL
 * @param {object} firebaseConfig
 * @return {string} deeplink
 */
async function generateDeeplink(link, frontDoorURL, firebaseConfig) {
  const { androidFallback, id, iosFallback, key, option, version, domain } = firebaseConfig;
  const response: any = await firebaseHttpClient(firebaseConfig)
    .post(`/${version}/shortLinks?key=${key}`, {
      suffix: {
        option,
      },
      dynamicLinkInfo: {
        domainUriPrefix: domain,
        navigationInfo: {
          enableForcedRedirect: true,
        },
        androidInfo: {
          androidFallbackLink: androidFallback,
          androidPackageName: id,
        },
        iosInfo: {
          iosBundleId: id,
          iosFallbackLink: iosFallback,
        },
        link: url.resolve(frontDoorURL, link),
      },
    })
    .execute();
  if (response.data.warning) {
    const { warning } = response.data;
    defaultLogger.info(`Code: ${warning[0].warningCode}`);
    defaultLogger.info(`Message: ${warning[0].warningMessage}`);
  }
  const deepLink = response.data.shortLink;
  defaultLogger.info(`generate_deep_link_response=${deepLink}`);
  return deepLink;
}
