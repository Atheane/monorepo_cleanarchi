export enum DiligenceType {
  INCOMING_SEPA_CREDIT_TRANSFER = 19,
  ACCOUNT_AGGREGATION = 20,
}

export enum DiligenceStatus {
  VALIDATED = 'Validated',
  REFUSED = 'Refused',
}

export interface SmoneyKycComplementaryDiligenceRequestPayload {
  type: DiligenceType;
  status: DiligenceStatus;
}

export interface SmoneyKycComplementaryDiligenceRequest {
  appUserId: string;
}
