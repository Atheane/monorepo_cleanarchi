import { AzureFunction, Context } from '@azure/functions';
import { ConfigService } from '@oney/env';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import * as path from 'path';
import { envConfiguration } from './config/EnvConfig';

const emailNotificationHandler: AzureFunction = async function (
  context: Context,
  message: any,
): Promise<void> {
  context.log(`received email notification`, message);
  try {
    context.log('Load configuration');
    await loadAppConfig();

    const email = {
      personalizations: [{ to: [{ email: message.recipient }] }],
      from: { email: message.from || envConfiguration.fromEmailAddress },
      subject: message.subject,
      content: [
        {
          type: 'text/html',
          value: message.content,
        },
      ],
    };

    context.log(`sending email notification to SENDGRID`, email);
    context.done(null, email);
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
  /* istanbul ignore next */ await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
}

export default emailNotificationHandler;
