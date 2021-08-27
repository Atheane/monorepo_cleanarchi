enum KycDecisionType {
  OK = 'OK',
  OK_MANUAL = 'OK_MANUAL',
  KO_MANUAL = 'KO_MANUAL',
  PENDING_ADDITIONAL_INFO = 'PENDING_ADDITIONAL_INFO',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PENDING_CLIENT = 'PENDING_CLIENT',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  KO = 'KO',
}

export interface KycFilters {
  uid: string;
  kycValues: {
    decision: KycDecisionType;
    sanctioned: KycDecisionType;
    politicallyExposed: KycDecisionType;
  };
}