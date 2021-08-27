import { Mapper } from '@oney/common-core';
import { Tips, TipsServiceProviders } from '@oney/profile-core';
import { injectable } from 'inversify';
import { CdpTips } from '../models/CdpTips';

@injectable()
export class CdpTipsMapper implements Mapper<Tips> {
  toDomain(raw: CdpTips): Tips {
    return new Tips({
      uid: raw.uid,
      provider: TipsServiceProviders.cdp,
      templateName: raw.templateName,
      title: raw.title,
      subtitle: raw.subtitle,
      ...(raw.redirectLink && {
        redirectLink: raw.redirectLink.trim(),
      }),
      ...(raw.actionButtonText && {
        actionButtonText: raw.actionButtonText,
      }),
      ...(raw.previewImg && {
        previewImg: raw.previewImg.trim(),
      }),
      ...(raw.details && {
        details: {
          rawHtml: raw.details.rawHtml,
          title: raw.details.title ? raw.details.title : raw.title,
          previewImg: raw.details.previewImg.trim(),
        },
      }),
    });
  }
}
