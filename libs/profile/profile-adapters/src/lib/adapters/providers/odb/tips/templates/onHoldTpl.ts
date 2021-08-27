import { TemplateName, Tips, TipsServiceProviders } from '@oney/profile-core';
import { onHoldHtml } from './htmls/onHold';

export function onHoldTpl(uid: string): Tips {
  return new Tips({
    provider: TipsServiceProviders.odb,
    uid: uid,
    templateName: TemplateName.hero,
    redirectLink: 'https://www.oney.fr',
    title: 'Dossier en cours de traitement',
    subtitle: 'Encore un peu de patience',
    previewImg:
      'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/illu-clock-wait.png?alt=media&token=2be85790-baab-403f-94cf-07b2e5845bc2',
    details: {
      rawHtml: onHoldHtml,
      title: 'Dossier en cours de traitement',
      previewImg:
        'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/illu-clock-wait.png?alt=media&token=2be85790-baab-403f-94cf-07b2e5845bc2',
    },
    actionButtonText: 'Sélectionné pour vous',
  });
}
