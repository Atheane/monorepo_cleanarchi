import { FacematchResult } from '@oney/profile-core';

export interface OneytrustFacematchRequest {
  caseReference: string;
  customerRank: number;
  selfieConsent: boolean;
  selfieConsentDate: Date;
  result: FacematchResult;
  msg: string;
}
