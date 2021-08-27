import * as _ from 'lodash';

export const topicOdbAccountPhoneOtpCreatedConfigSms = {
  recipient: 'topic_msg.phone',
  condition: payload => !!_.get(payload, 'topic_msg.phone', null),
  deeplinks: {
    validation_link: payload => {
      return `${payload.base_url.odb_authentication}/register/validate-sms?invitation_token=${payload.topic_msg.token}`;
    },
  },
};
