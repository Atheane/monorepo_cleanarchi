export interface SmoneyKycFile {
  name: string;
}

export interface SmoneyKycFileRequest extends SmoneyKycFile {
  content: string;
}

export interface SmoneyKycFileResponse extends SmoneyKycFile {
  key: string;
}
