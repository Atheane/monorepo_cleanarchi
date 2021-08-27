import { ICdpEligibilityPayload } from './ICdpEligibilityPayload';

export interface ICustomBalanceLimitCalculatedPayload extends ICdpEligibilityPayload {
  customBalanceLimit?: number;
  verifiedRevenues?: number;
  evt7Motive?: string;
  evt8Motive?: string;
  evt9Amiable?: boolean;
  evt9Motive?: string;
  evt11Bloque?: boolean;
  evt11Motive?: string;
  evt16Motive?: string;
  customerSituationData?: object;
  odbData?: {
    accountEligibility?: boolean;
    nbrOutstanding?: number;
    sourceRevenues?: string;
    rawRevenues: string;
  };
}
