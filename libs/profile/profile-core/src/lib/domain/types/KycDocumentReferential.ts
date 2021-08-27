import { DocumentSide } from '@oney/profile-core';
import { CountryCode } from '@oney/profile-messages';

export interface DocumentOptions {
  documentSide?: DocumentSide;
  elementCategory: string;
  elementSubCategory: string;
  elementType: number;
}

export interface KycDocumentReferential {
  aliases: {
    fullname: string;
    alpha2: CountryCode;
    alpha3: string;
  };
  documents: {
    id: DocumentOptions[];
    passport: DocumentOptions[];
    residence_permit_before_2011: DocumentOptions[];
    residence_permit_after_2011: DocumentOptions[];
  };
}
