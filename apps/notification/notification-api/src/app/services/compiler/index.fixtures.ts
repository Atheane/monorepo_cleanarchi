export default {
  config: {
    type: 'email',
    name: 'email.fr.create_transfer',
    enrich: [
      {
        resource: 'odbAccount/user',
        identifier: 'sender.id',
        fields: ['user_profile.first_name', 'user_profile.birth_name', 'email'],
        as: 'issuer',
      },
    ],
    recipient: 'topic_msg.beneficiary.email',
  },
  wrongConfig: {
    type: 'wrong_folder',
    name: 'email.fr.odb_transactions.non_existing_template',
    enrich: [
      {
        resource: 'odb_account/user',
        identifier: 'uid',
        fields: ['user_profile.first_name', 'user_profile.birth_name', 'email'],
        as: 'issuer',
      },
    ],
    recipient: 'issuer.email',
  },
  payload: {
    issuer: {
      user_profile: {
        first_name: 'Corinne',
        birth_name: 'Berthier',
      },
      email: 'samy.ouachek@domain.com',
    },
    topic_msg: {
      sender: {
        id: 'abcde123',
      },
      amount: 1000,
      reason: 'Votre remboursement',
    },
  },
  success:
    // eslint-disable-next-line max-len
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<body>\n<p>\n  Bonjour,\n</p>\n<p>\n  Un virement de 10€ de la part de Corinne Berthier pour le motif : Votre remboursement est en cours de traitement.\n</p>\n<p>\n  Vous recevrez les fonds d\'ici un à trois jours.\n</p>\n<p>\n  Nous vous en souhaitons bonne réception,<br>\n  Cordialement<br>\n  L\'équipe Oney\n</p>\n</body>\n</html>\n',
};
