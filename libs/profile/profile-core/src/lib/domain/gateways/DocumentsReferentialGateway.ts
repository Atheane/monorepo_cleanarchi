import { CountryCode } from '@oney/profile-messages';
import { DocumentSide, DocumentType } from '@oney/profile-core';
import { KycDocumentReferential } from '../types/KycDocumentReferential';

export interface DocumentsReferentialGateway {
  getKycDocumentConf(nationality: CountryCode, documentType: DocumentType, documentSide?: DocumentSide);

  getReferential(): KycDocumentReferential[];
}
