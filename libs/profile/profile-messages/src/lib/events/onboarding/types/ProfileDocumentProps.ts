export enum DocumentType {
  ID_DOCUMENT = 'id',
  PASSPORT = 'passport',
  RESIDENCE_PERMIT_BEFORE_2011 = 'residence_permit_before_2011',
  RESIDENCE_PERMIT_AFTER_2011 = 'residence_permit_after_2011',
  TAX_NOTICE = 'tax_notice',
}

export enum DocumentSide {
  FRONT = 'front',
  BACK = 'back',
}

export enum ProfileDocumentPartner {
  KYC = 'KYC',
  ODB = 'ODB',
}

export interface ProfileDocumentProps {
  uid: string;
  type: DocumentType;
  side?: DocumentSide;
  partner: ProfileDocumentPartner;
  location?: string;
}
