import * as _ from 'lodash';

export const odbPaymentTopicConfig = {
  subject: 'Vous avez reçu un virement',
  enrich: [
    {
      resource: 'odbAccount/user',
      identifier: 'sender.id',
      fields: ['user_profile.first_name', 'user_profile.birth_name', 'email'],
      as: 'issuer',
    },
  ],
  recipient: 'topic_msg.recipientEmail',
  condition: payload => {
    return !!_.get(payload, 'topic_msg.recipientEmail', null);
  },
};
