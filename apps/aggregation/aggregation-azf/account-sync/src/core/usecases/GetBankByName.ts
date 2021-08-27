import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifier } from '../../config/di';
import { BudgetInsightConnectionService } from '../adapters/budgetInsight/repositories/BudgetInsightConnectionService';

export interface GetBankByNameCommand {
  bankId: string;
  userToken: string;
}

@injectable()
export class GetBankByName implements Usecase<GetBankByNameCommand, string> {
  constructor(
    @inject(Identifier.biConnectionService)
    private readonly biConnectionService: BudgetInsightConnectionService,
  ) {}

  async execute(request: GetBankByNameCommand): Promise<string> {
    const { bankId, userToken } = request;
    this.biConnectionService.setCredentials(userToken);
    const { name } = await this.biConnectionService.getBankById(bankId);
    return name;
  }
}
