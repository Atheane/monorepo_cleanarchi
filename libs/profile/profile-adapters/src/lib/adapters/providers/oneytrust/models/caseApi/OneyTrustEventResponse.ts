export enum OneytrustEventScoreStatus {
  DONE = 'DONE',
}

export enum OneytrustEventDecision {
  MISMATCH = 'MISMATCH',
  MATCH = 'MATCH',
  MISSING_DATA = 'MISSING_DATA',
}

export interface OneyTrustEventResponse {
  url: string;
  eventId: number;
  eventScore: number;
  scoreStatus: OneytrustEventScoreStatus;
  decision: OneytrustEventDecision;
}
