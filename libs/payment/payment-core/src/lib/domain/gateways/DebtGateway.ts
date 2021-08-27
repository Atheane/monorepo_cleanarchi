import { Debt } from '../entities/Debt';

export interface DebtGateway {
  getDebtsBy(userId: string): Promise<Debt[]>;
  updateRemainingAmount(debt: Debt): Promise<void>;
  updateStatus(debt: Debt): Promise<void>;
}
