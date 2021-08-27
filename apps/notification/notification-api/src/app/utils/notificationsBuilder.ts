import * as glob from 'glob-promise';
import * as path from 'path';
import { config } from '../config/config.env';
import { odbPaymentTopicConfig } from '../notifications/odb_payment_topic/email.fr.create_transfer';
import { topicNifiCardOperationConfig } from '../notifications/topic_nifi_card-operation/push.fr.card_operation';
import { topicOdbAccountPhoneOtpCreatedConfig } from '../notifications/topic_odb-account_phone-otp-created/sms.fr.phone_otp';
import { topicOdbAccountUnvalidatedUserCreatedConfig } from '../notifications/topic_odb-account_unvalidated-user-created/email.fr.validate_user_email';
import { topicOdbAccountUserAccountCreatedConfig } from '../notifications/topic_odb-account_user-account-created/pdf.fr.create_bis';
import { topicOdbAggregationThirdPartyAuthSucessConfig } from '../notifications/topic_odb-aggregation_third-party-auth-success/push.fr.third-party-auth-success';
import { topicOdbAuthenticationMagicLinkConfig } from '../notifications/topic_odb-authentication_magic-link/email.fr.magic_link';
import { topicOdbTransactionsGeneratedStatement } from '../notifications/topic_odb-transactions-generated_statement/pdf.fr.account_statement';
import { topicOdbNotificationConfig } from '../notifications/topic_odb_notification/email.fr.failed_provisioning';
import { topicOdbAccountPhoneOtpCreatedConfigSms } from '../notifications/topic_odb-account_unvalidated-user-created-sms/sms.fr.validate_user_phone';

const notificationsConfigsByTopic = {
  odb_payment_topic: odbPaymentTopicConfig,
  topic_odb_notification: topicOdbNotificationConfig,
  'topic_nifi_card-operation': topicNifiCardOperationConfig,
  'topic_odb-account_phone-otp-created': topicOdbAccountPhoneOtpCreatedConfig,
  'topic_odb-account_unvalidated-user-created': topicOdbAccountUnvalidatedUserCreatedConfig,
  'topic_odb-account_unvalidated-user-created-sms': topicOdbAccountPhoneOtpCreatedConfigSms,
  'topic_odb-account_user-account-created': topicOdbAccountUserAccountCreatedConfig,
  'topic_odb-aggregation_third-party-auth-success': topicOdbAggregationThirdPartyAuthSucessConfig,
  'topic_odb-authentication_magic-link': topicOdbAuthenticationMagicLinkConfig,
  'topic_odb-transactions-generated_statement': topicOdbTransactionsGeneratedStatement,
};
let notificationsConfig = null;

/**
 * Get the notifications configuration
 * @return {null|Promise<{}>}
 */
export default function getNotificationsConfig() {
  if (notificationsConfig !== null) {
    return notificationsConfig;
  }

  return buildConfig();
}

/**
 * Build the notifications configuration.
 * This function is meant to look up all the configurations files available in
 * the `src/notification` folder and build a notifications configuration
 * object which can be used as reference by the rest of the service
 * @return {Promise<{}>}
 */
async function buildConfig() {
  const notificationsConfigsBuilded = {};
  const { appInfo } = config;
  const pathFile =
    appInfo.env === 'production' || appInfo.env === 'test' ? '/..' : '/../notification-api/src/app';
  const resolvePath = path.resolve(__dirname + pathFile);
  const configsPath = await glob(resolvePath + '/notifications/**/*.js', {
    ignore: [resolvePath + '/notifications/**/*.mock.js', resolvePath + '/notifications/**/*.spec.js'],
  });
  console.log(configsPath);

  for (const configPath of configsPath) {
    const split = configPath.split('/');
    const topic = split[split.length - 2];
    const name = split[split.length - 1];
    if (topic !== 'test') {
      const config: any = notificationsConfigsByTopic[topic];
      config.name = path.basename(configPath).replace(/\.[^/.]+$/, '');
      config.type = name.split('.')[0];
      if (!notificationsConfigsBuilded[topic]) {
        notificationsConfigsBuilded[topic] = [];
      }
      notificationsConfigsBuilded[topic].push(config);
    }
  }

  notificationsConfig = notificationsConfigsBuilded;
  return notificationsConfig;
}
