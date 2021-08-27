import { TemplateName, Tips, TipsServiceProviders } from '@oney/profile-core';

export function actionRequiredIdTpl(uid: string): Tips {
  return new Tips({
    provider: TipsServiceProviders.odb,
    uid: uid,
    templateName: TemplateName.hero,
    redirectLink: 'odb://odb/identity-document',
    title: 'Merci de nous fournir à nouveau votre pièce d’identité',
    subtitle: 'Nous avons rencontré un problème',
    previewImg:
      'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/illu-clock-wait.png?alt=media&token=2be85790-baab-403f-94cf-07b2e5845bc2',
  });
}
