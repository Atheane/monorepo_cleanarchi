import { TemplateName, TipsDetails } from '@oney/profile-core';

export type CdpTips = {
  uid: string;
  templateName: TemplateName;
  title: string;
  subtitle: string;
  redirectLink?: string;
  actionButtonText?: string;
  previewImg?: string;
  details?: TipsDetails;
  correlationId?: string;
  erreur?: string;
};
