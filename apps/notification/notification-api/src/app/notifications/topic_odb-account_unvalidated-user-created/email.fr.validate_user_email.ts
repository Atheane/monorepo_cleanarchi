import * as _ from 'lodash';

export const topicOdbAccountUnvalidatedUserCreatedConfig = {
  subject: 'Validez votre compte Oney Bank',
  recipient: 'topic_msg.email',
  condition: payload => !!_.get(payload, 'topic_msg.email', null),
  deeplinks: {
    validation_link: payload => {
      return `${payload.base_url.odb_authentication}/register/validate?invitation_token=${payload.topic_msg.token}`;
    },
  },
};
