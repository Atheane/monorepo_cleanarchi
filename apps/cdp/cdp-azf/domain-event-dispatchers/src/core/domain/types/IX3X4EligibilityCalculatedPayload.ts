import { ICdpEligibilityPayload } from './ICdpEligibilityPayload';

export interface IX3X4EligibilityCalculatedPayload extends ICdpEligibilityPayload {
  evt7Motive?: string;
  evt8Motive?: string;
  evt9Amiable?: boolean;
  evt9Motive?: string;
  evt10EncoursCredit?: boolean;
  evt10Motive?: string;
  evt11Bloque?: boolean;
  evt11Motive?: string;
  evt12Motive?: string;
  customerSituationData?: object;
  odbData?: {
    nbrOutstanding?: number;
    outstandingAmount?: number;
    accountEligibility?: boolean;
  };
}
