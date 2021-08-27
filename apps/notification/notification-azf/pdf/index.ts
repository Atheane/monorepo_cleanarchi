import { AzureFunction, Context } from '@azure/functions';
import { ConfigService } from '@oney/env';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import * as wkhtmltopdf from 'wkhtmltopdf';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { envConfiguration } from './config/EnvConfig';
import { createFile, initFileStorage } from './fileStorage';

const writeFileAsync = util.promisify(fs.writeFile);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
wkhtmltopdf.command = `${__dirname}/wkhtmltopdf`;

const defaultConfig = {
  pageSize: 'A4',
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  disableSmartShrinking: true,
  printMediaType: true,
  debug: true,
};

const pdfNotificationHandler: AzureFunction = async function (context: Context, message: any): Promise<void> {
  context.log(`received pdf notification`, message);
  try {
    context.log('Load configuration');
    await loadAppConfig();

    const tempDir = os.tmpdir();
    const messageId = context.bindingData.messageId;
    let wkConfig = { ...defaultConfig };

    if (message.pdfOptions) {
      wkConfig = { ...wkConfig, ...message.pdfOptions };
    }

    if (message.footer) {
      const footerPath = path.join(tempDir, `${messageId}.footer.html`);
      await writeFileAsync(footerPath, message.footer, 'UTF-8');

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      wkConfig = { ...wkConfig, footerHtml: footerPath };
    }

    context.log(`initiating file storage`);
    await initFileStorage(envConfiguration.blobStorageCs, envConfiguration.storageContainerName);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const stream = wkhtmltopdf(message.content, wkConfig);

    context.log(`creating PDF`);
    await createFile(message.path, stream, context);

    context.done(null, true);
  } catch (error) {
    context.log('Error happened while processing the email notification:', error);
    context.res = {
      status: INTERNAL_SERVER_ERROR,
      error: error.message,
    };
  }
};

async function loadAppConfig() {
  const envPath = path.resolve(__dirname + '/local.env'); // We ignore this test case because we dont want to test app in Production mode.
  /* istanbul ignore next */
  await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
}

export default pdfNotificationHandler;
