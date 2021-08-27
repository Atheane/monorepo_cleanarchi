export const topicOdbAccountUserAccountCreatedConfig = {
  path: payload => `bis/${payload.topic_msg.account.uid}/${payload.topic_msg.account.bid}.pdf`,
};
