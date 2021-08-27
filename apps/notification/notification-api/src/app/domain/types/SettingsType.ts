import { ChannelEnum } from './ChannelEnum';
import { PdfOptionsType } from './PdfOptionsType';

export type SettingsType = {
  contentBodyPath: string;
  contentFooterPath?: string;
  path?: string;
  from?: string;
  pdfOptions?: PdfOptionsType;
  subject?: string;
  recipient?: string;
  channel: ChannelEnum;
};
