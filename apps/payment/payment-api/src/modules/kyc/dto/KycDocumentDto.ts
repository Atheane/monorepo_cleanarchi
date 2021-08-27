import { File, KycDocumentStatus } from '@oney/payment-core';

export interface KycDocumentDto {
  uid: string;
  files: File[];
  status?: KycDocumentStatus;
}
