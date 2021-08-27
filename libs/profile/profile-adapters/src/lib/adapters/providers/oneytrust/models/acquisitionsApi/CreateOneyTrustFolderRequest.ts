export enum OneytrustChannel {
  APP = 'APP',
}

export interface CreateOneyTrustFolderRequest {
  caseReference: string;
  masterReference: string;
  entityReference: number;
  caseType: number;
  language: string;
  channel: OneytrustChannel;
  callbackUrl: string;
  formData: {
    email: string;
    phone: string;
  };
}
