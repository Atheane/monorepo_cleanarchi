import { ICdpEligibilityPayload } from './ICdpEligibilityPayload';

export interface IAccountEligibilityCalculatedPayload extends ICdpEligibilityPayload {
  balanceLimit?: number;
  evt2Contentieux?: boolean;
  evt2Motive?: string;
  evt3Surendettement?: boolean;
  evt3Motive?: string;
  evt4Revoque?: boolean;
  evt4Motive?: string;
  evt5PlanSurendettement?: boolean;
  evt5Motive?: string;
  evt6Reamenagement?: boolean;
  evt6Motive?: string;
  evt7Motive?: string;
  evt13Motive?: string;
  evt14Motive?: string;
  balanceLimitMotive?: string;
  customerSituationData?: object;
  odbData?: {
    rawFicpFccAt?: string;
    flagFicp?: boolean;
    flagFcc?: boolean;
    nbrOutstanding?: number;
  };
}
