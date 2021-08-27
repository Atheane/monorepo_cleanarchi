import { Debt } from '../../domain/entities/Debt';
import { DebtGateway } from '../../domain/gateways/DebtGateway';

export class DebtGatewayStub implements DebtGateway {
  private readonly inMemory = [];

  constructor(debts: Debt[]) {
    this.inMemory = debts;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDebtsBy(userId: string): Promise<Debt[]> {
    return Promise.resolve(this.inMemory);
  }

  async updateRemainingAmount(debt: Debt): Promise<void> {
    Promise.resolve(debt);
  }

  async updateStatus(debt: Debt): Promise<void> {
    Promise.resolve(debt);
  }
}
