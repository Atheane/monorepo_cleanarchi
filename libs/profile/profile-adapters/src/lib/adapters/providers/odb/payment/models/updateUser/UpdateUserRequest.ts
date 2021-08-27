import { FiscalReference } from '@oney/profile-core';

export type DeclarativeFiscalSituationRequest = {
  income: string;
  economicActivity: string;
};

export type UpdateUserRequest = {
  uid: string;
  phone?: string;
  fiscalReference?: FiscalReference;
  declarativeFiscalSituation: DeclarativeFiscalSituationRequest;
};
