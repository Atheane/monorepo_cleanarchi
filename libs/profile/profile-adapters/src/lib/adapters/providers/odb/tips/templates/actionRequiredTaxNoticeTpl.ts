import { TemplateName, Tips, TipsServiceProviders } from '@oney/profile-core';

export function actionRequiredTaxNoticeTpl(uid: string): Tips {
  return new Tips({
    provider: TipsServiceProviders.odb,
    uid: uid,
    templateName: TemplateName.hero,
    redirectLink: 'odb://odb/tax-notice',
    title: "Merci de nous fournir votre dernier avis d'imposition",
    subtitle: 'Nous avons rencontré un problème',
    previewImg:
      'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/illu-clock-wait.png?alt=media&token=2be85790-baab-403f-94cf-07b2e5845bc2',
  });
}
