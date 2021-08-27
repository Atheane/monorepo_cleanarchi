import { defaultLogger } from '@oney/logger-adapters';
import * as _ from 'lodash';
import { config } from '../../config/config.env';
import getNotificationsConfig from '../../utils/notificationsBuilder';
import { compile } from '../compiler';
import { getDeeplinks } from '../deeplink';
import { enrich } from '../enricher';
import notifier from '../notifier';

/**
 * Processes a single message
 * @param {Object} message Message to process
 * @param {String} topic The name of the topic from which the message comes from
 * @return {Promise<void>}
 */
export async function processMessage(message, topic) {
  defaultLogger.info(`press_message_topic_name=${topic}`);
  const notificationsConfig = await getNotificationsConfig();
  const topicName = topic;
  const notifications = notificationsConfig[topicName] || [];

  const notificationsToProcess = [];
  for (const notification of notifications) {
    notificationsToProcess.push(processNotification(message, notification, topicName));
  }

  await Promise.all(notificationsToProcess);
}

/**
 * Process a notification
 * @param {Object} message The notification to process
 * @param {Object} notification The notification config
 * @param {String} topicName Name of the message topic
 * @return {Promise<void>}
 */
export async function processNotification(message, notification, topicName): Promise<void> {
  defaultLogger.info(`notification_type=${notification.type}`);

  const { corporateBankInfo, accountApiUrl, authenticationApiUrl } = config;
  /* eslint-disable camelcase */
  const { name, city, street, zip_code, country, customer_service, capital } = corporateBankInfo;
  let messageContent = message.body;

  if (typeof messageContent === 'string') {
    messageContent = JSON.parse(messageContent);
  }

  let payload: any = {
    corporate: {
      name,
      customer_service: customer_service,
      capital: capital,
      address: {
        city,
        street,
        zip_code,
        country,
      },
    },
    base_url: {
      odb_account: accountApiUrl,
      odb_account_management: accountApiUrl,
      odb_authentication: authenticationApiUrl,
    },
    topic_msg: { ...messageContent },
  };

  if (notification.condition && !notification.condition(payload)) {
    return;
  }

  const enrichedPayload: any = await enrich(messageContent, notification);

  payload = {
    ...payload,
    ...enrichedPayload,
  };

  payload.deeplinks = await getDeeplinks(payload, notification, {
    firebaseConfig: config.firebaseConfiguration,
    frontDoorURL: config.frontDoorUrl,
  });

  const compiledTemplates = await compile(payload, notification, topicName);
  const recipient = _.get(payload, notification.recipient);

  const compiled: any = {
    recipient,
    ...compiledTemplates,
    subject: notification.subject,
  };

  if (notification.path) {
    compiled.path = notification.path(payload);
  }

  if (notification.pdfOptions) {
    compiled.pdfOptions = notification.pdfOptions;
  }

  await notifier[notification.type](compiled);
}
