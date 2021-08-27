import { ICdpEligibilityPayload } from './ICdpEligibilityPayload';

export interface AccountIncomeVerification {
  accountAggregatedId: number;
  valid: boolean;
}

export interface IAggregatedAccountsIncomesCheckedPayload extends ICdpEligibilityPayload {
  possibleRevenuesDetected?: Array<AccountIncomeVerification>;
}
