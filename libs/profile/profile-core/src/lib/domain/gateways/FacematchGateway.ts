import { FacematchResult } from '../types/FacematchResult';

export interface SendFacematchRequest {
  caseReference: string;
  customerRank: number;
  selfieConsent: boolean;
  selfieConsentDate: Date;
  result: FacematchResult;
  msg: string;
}

export interface FacematchGateway {
  sendFacematch(request: SendFacematchRequest): Promise<void>;
}
