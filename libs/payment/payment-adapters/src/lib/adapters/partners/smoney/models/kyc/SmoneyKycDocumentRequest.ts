import { SmoneyKycFileRequest } from './SmoneyKycFile';

export enum SmoneyIdTypes {
  ID_FRONT = 1,
  ID_BACK = 1,
  PASSPORT = 2,
  RESIDENCE_BEFORE_2011_FRONT = 5,
  RESIDENCE_BEFORE_2011_BACK = 5,
  RESIDENCE_AFTER_2011_FRONT = 5,
  RESIDENCE_AFTER_2011_BACK = 5,
}

export interface SmoneyKycDocumentRequest {
  uid: string;
  type: number;
  files: [SmoneyKycFileRequest, SmoneyKycFileRequest?];
}
