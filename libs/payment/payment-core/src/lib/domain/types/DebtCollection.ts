import { Debt } from '../entities/Debt';

export interface DebtCollection {
  debt: Debt;
  amountToCollect: number;
}
