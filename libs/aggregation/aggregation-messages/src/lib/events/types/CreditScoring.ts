export interface ScoreIndicators {
  savings: number;
  lifestyle: number;
  cash: number;
}

export interface CreditScoring {
  rate: number;
  indicators: ScoreIndicators;
}
