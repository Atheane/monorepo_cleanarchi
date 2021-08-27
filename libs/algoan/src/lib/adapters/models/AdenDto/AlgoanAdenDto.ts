import { Budget } from './Budget';
import { Bureau } from './Bureau';

export interface AlgoanCreditScoreIndicatorsDto {
  savings: number;
  lifestyle: number;
  cash: number;
}

export interface AlgoanCreditScoreDto {
  score: number;
  indicators: AlgoanCreditScoreIndicatorsDto;
}

export interface AdenDto {
  score: AlgoanCreditScoreDto;
  budget: Budget;
  bureau: Bureau;
  dataQuality: {};
}
