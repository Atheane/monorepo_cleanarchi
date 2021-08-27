import { SmoneyKycFileResponse } from './SmoneyKycFile';

export interface SmoneyKycDocumentResponse {
  type: string;
  status: string;
  files: [SmoneyKycFileResponse, SmoneyKycFileResponse?];
}

export interface ODBKycResponse extends SmoneyKycDocumentResponse {
  uid: string;
}
