import { CountryCode } from '@oney/profile-messages';
import { ProfileDocument } from '../aggregates/ProfileDocument';
import { DocumentSide } from '../types/DocumentSide';
import { DocumentType } from '../types/DocumentType';

export class UploadDocumentCommand {
  uid: string;
  file: any;
  documentType: DocumentType;
  documentSide?: DocumentSide;
  nationality?: CountryCode;
}

export interface KycGateway {
  uploadDocument(caseReference: string, command: UploadDocumentCommand): Promise<ProfileDocument>;
  deleteDocument(caseReference: string, fileId: string): Promise<void>;
}
