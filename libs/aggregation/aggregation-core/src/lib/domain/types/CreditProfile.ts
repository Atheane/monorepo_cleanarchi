import { CreditInsights } from './CreditInsights/CreditInsights';
import { CreditScoring } from './CreditScoring';

export interface CreditProfile {
  creditScoring: CreditScoring;
  creditInsights: CreditInsights;
}
