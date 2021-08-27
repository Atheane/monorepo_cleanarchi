import { PublicProperties } from '@oney/common-core';

export class TipsDetails {
  title: string;
  rawHtml: string;
  previewImg?: string;

  constructor(tipsDetail: PublicProperties<TipsDetails>) {
    Object.assign(this, tipsDetail);
  }
}
