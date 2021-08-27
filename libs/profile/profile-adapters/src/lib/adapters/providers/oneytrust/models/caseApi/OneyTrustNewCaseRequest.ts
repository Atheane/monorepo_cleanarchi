export enum caseType {
  TAX_NOTICE = 97,
}

export enum OneytrustNewCaseChannel {
  APP = 'APP',
}

export enum OneytrustNewCaseLanguage {
  FR = 'FR',
}

export interface OneyTrustNewCaseRequest {
  caseReference: string;
  caseType: caseType;
  masterReference: string;
  language: OneytrustNewCaseLanguage;
  channel: OneytrustNewCaseChannel;
}
