import { defaultLogger } from '@oney/logger-adapters';

const eventSource = {
  ODB_AUTHENTICATION: 'ODB_AUTHENTICATION',
};

export const topicOdbNotificationConfig = {
  subject: 'Erreur d’enrôlement utilisateur',
  recipient: 'topic_msg.data.primaryEmail',
  condition: payload => {
    defaultLogger.info(`FAILED PROVISIONING PAYLOAD: ${JSON.stringify(payload.topic_msg)}`);

    /** @type { { origin: string; data: { type: string; } } } */
    const {
      origin,
      data: { type: errorType },
    } = payload.topic_msg;

    return origin === eventSource.ODB_AUTHENTICATION && errorType.includes('PROVISION_CLIENT_FAIL');
  },
};
