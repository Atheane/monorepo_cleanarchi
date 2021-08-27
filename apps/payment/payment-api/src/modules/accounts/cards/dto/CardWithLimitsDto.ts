import { CardDTO } from '../../../user/dto/CardDTO';

export interface CardWithLimitsDto extends CardDTO {
  maxAtmWeeklyAllowance: number;
  maxMonthlyAllowance: number;
}
