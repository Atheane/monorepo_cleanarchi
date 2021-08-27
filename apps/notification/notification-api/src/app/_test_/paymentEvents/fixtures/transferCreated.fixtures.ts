export const transferCreatedMessageWithReason = {
  body: {
    content:
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<body>\n<p>\n  Bonjour,\n</p>\n<p>\n  Un virement de 1000€ de la part de Samy Gotrois pour le motif : Raison valable est en cours de traitement.\n</p>\n<p>\n  Vous recevrez les fonds d\'ici un à trois jours.\n</p>\n<p>\n  Nous vous en souhaitons bonne réception,<br>\n  Cordialement<br>\n  L\'équipe Oney\n</p>\n</body>\n</html>\n',
    subject: 'Vous avez reçu un virement',
    recipient: 'receipientemail@yopmail.com',
  },
};

export const transferCreatedMessageWithoutReason = {
  body: {
    content:
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<body>\n<p>\n  Bonjour,\n</p>\n<p>\n  Un virement de 1000€ de la part de Samy Gotrois est en cours de traitement.\n</p>\n<p>\n  Vous recevrez les fonds d\'ici un à trois jours.\n</p>\n<p>\n  Nous vous en souhaitons bonne réception,<br>\n  Cordialement<br>\n  L\'équipe Oney\n</p>\n</body>\n</html>\n',
    subject: 'Vous avez reçu un virement',
    recipient: 'receipientemail@yopmail.com',
  },
};
