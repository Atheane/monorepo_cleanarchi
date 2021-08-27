import { PdfOptionsType } from './PdfOptionsType';

export type DataSendType = {
  pdfOptions?: PdfOptionsType;
  content: string;
  from?: string;
  footer?: string;
  path?: string;
  subject?: string;
  recipient?: string;
};
