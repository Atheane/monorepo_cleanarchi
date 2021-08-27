export interface OneytrustConfig {
  otBaseUrl: string;
  secretKey: string;
  entityReference: number;
  login: string;
  oneyTrustFolderBaseApi: string;
  caseType: number;
  language: string;
  flagCallbackUrlInPayload: boolean;
  callbackDecisionUrl: string;
}
