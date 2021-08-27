export const topicOdbAuthenticationMagicLinkConfig = {
  subject: 'Accéder à Oney Bank',
  recipient: 'topic_msg.email',
  deeplinks: {
    magic_link: payload => {
      return `${payload.topic_msg.path}?token=${payload.topic_msg.token}&otp=${payload.topic_msg.otp}`;
    },
  },
};
