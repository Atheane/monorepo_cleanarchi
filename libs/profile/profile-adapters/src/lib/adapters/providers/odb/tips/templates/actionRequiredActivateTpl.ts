import { TemplateName, Tips, TipsServiceProviders } from '@oney/profile-core';
import { actionRequiredActivateHtml } from './htmls/actionRequiredActivateHtml';

export function actionRequiredActivateTpl(uid: string): Tips {
  return new Tips({
    provider: TipsServiceProviders.odb,
    uid: uid,
    templateName: TemplateName.hero,
    redirectLink: 'https://www.oney.fr',
    title: 'Activez votre compte',
    subtitle: "Une dernière étape et c'est tout bon",
    previewImg:
      'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/illu-clock-wait.png?alt=media&token=2be85790-baab-403f-94cf-07b2e5845bc2',
    details: {
      rawHtml: actionRequiredActivateHtml,
      title: "Il est temps d'activer votre compte",
      previewImg:
        'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/illu-clock-wait.png?alt=media&token=2be85790-baab-403f-94cf-07b2e5845bc2',
    },
    actionButtonText: 'Sélectionné pour vous',
  });
}
