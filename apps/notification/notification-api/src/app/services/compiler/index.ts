import * as _ from 'lodash';
import { Currency, CurrencySymbols } from '@oney/common-core';
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';
import * as fs from 'fs';
import * as path from 'path';
import { config as configApp } from '../../config/config.env';

const compiler = handlebars.create();
helpers({ handlebars: compiler });
compiler.registerHelper('transformToCurrency', (item: Currency) => CurrencySymbols[item]);
compiler.registerHelper('for', (from, to, incr, block) => {
  let accum = '';
  for (let i = from; i < to; i += incr) {
    accum += block.fn(i);
  }
  return accum;
});
compiler.registerHelper('samePreviousProperty', (array, key, path, options) => {
  if (key === 0 || !_.get(array[key - 1], path) || _.get(array[key - 1], path) !== _.get(array[key], path)) {
    return options.inverse(this);
  }
  return options.fn(this);
});
/**
 * Check if the file at a specific path really exist
 * @param {String} path Path to the file
 * @return {Promise<Boolean>}
 */
function doesFileExist(path) {
  return fs.promises
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

/**
 * Compile a handlebar template with the provided payload
 * @param {Object} payload The data used to populate the template
 * @param {Object} config The notification configuration
 * @param {String} topicName Name of the message topic
 * @return {Promise<{content: string, footer: string}>} The compiled HTML template
 */
export async function compile(payload, config, topicName) {
  const res: any = {};
  const { appInfo } = configApp;
  const prefix =
    appInfo.env === 'production' || appInfo.env === 'test'
      ? '../../notifications'
      : '../notification-api/src/app/notifications';
  const contentPath = path.join(__dirname, `${prefix}/${topicName}/${config.name}.html`);
  const contentTemplate = await fs.promises.readFile(contentPath, 'utf-8');
  res.content = compiler.compile(contentTemplate)(payload);

  const footerPath = path.join(__dirname, `${prefix}/${topicName}/${config.name}.footer.html`);

  if (await doesFileExist(footerPath)) {
    const footerTemplate = await fs.promises.readFile(footerPath, 'utf-8');
    res.footer = compiler.compile(footerTemplate)(payload);
  }

  return res;
}
