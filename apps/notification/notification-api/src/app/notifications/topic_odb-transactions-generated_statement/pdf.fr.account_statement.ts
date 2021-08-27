export const topicOdbTransactionsGeneratedStatement = {
  path: payload => `bank_statements/${payload.topic_msg.uid}/${payload.topic_msg.asid}.pdf`,
  pdfOptions: {
    marginBottom: '2.5cm',
  },
  enrich: [
    {
      resource: 'odbAccount/user',
      identifier: 'uid',
      fields: ['user_profile', 'user_profile'],
      as: 'issuer',
    },
    {
      resource: 'odbAccountManagement/bankaccount',
      identifier: 'uid',
      fields: ['iban', 'bic'],
      as: 'issuer_bankaccount',
    },
  ],
};
