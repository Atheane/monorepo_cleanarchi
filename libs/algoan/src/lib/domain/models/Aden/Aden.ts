import { Budget } from './Budget';
import { Bureau } from './Bureau';

export interface AlgoanCreditScoreIndicators {
  savings: number;
  lifestyle: number;
  cash: number;
}

export interface AlgoanCreditScore {
  score: number;
  indicators: AlgoanCreditScoreIndicators;
}

export interface Aden {
  score: AlgoanCreditScore;
  budget: Budget;
  bureau: Bureau;
  dataQuality: {};
}
