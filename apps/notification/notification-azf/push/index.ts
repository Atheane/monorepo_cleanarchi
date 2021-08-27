import { AzureFunction, Context } from '@azure/functions';
import { ConfigService } from '@oney/env';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import * as superagent from 'superagent';
import * as path from 'path';
import { envConfiguration } from './config/EnvConfig';

const pushNotificationHandler: AzureFunction = async function (
  context: Context,
  message: any,
): Promise<void> {
  context.log(`received push notification`, message);
  try {
    context.log('Load configuration');
    await loadAppConfig();

    const { subject, content, recipient } = message;
    const payload = subject && content && recipient ? formatLegacyNotification(message) : message;

    context.log(`sending push notification to firebase function`, payload);
    const response = await superagent
      .post(`${envConfiguration.firebaseBaseUrl}/api/notification/multicast`)
      .auth(
        envConfiguration.firebaseBasicAuthConfig.username,
        envConfiguration.firebaseBasicAuthConfig.password,
      )
      .send(payload);

    context.res = { payload, response };
    context.done();
  } catch (error) {
    context.log('Error happened while processing the push notification:', error);
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

const formatLegacyNotification = message => {
  return {
    notification: {
      display: {
        title: message.subject,
        message: message.content,
      },
    },
    userIds: [message.recipient],
  };
};

export default pushNotificationHandler;
