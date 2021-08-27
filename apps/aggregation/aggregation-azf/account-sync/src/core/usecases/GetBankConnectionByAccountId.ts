import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifier } from '../../config/di';
import { BankConnection } from '../domain/entities';
import { BudgetInsightConnectionService } from '../adapters/budgetInsight/repositories/BudgetInsightConnectionService';
import { BankConnectionRepository } from '../domain/repositories';

export interface GetConnectionCommand {
  bankAccountId: string;
  userToken: string;
}

@injectable()
export class GetBankConnectionByAccountId implements Usecase<GetConnectionCommand, BankConnection> {
  constructor(
    @inject(Identifier.biConnectionService)
    private readonly biConnectionService: BudgetInsightConnectionService,
    @inject(Identifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
  ) {}

  async execute(request: GetConnectionCommand): Promise<BankConnection> {
    const { bankAccountId, userToken } = request;
    this.biConnectionService.setCredentials(userToken);
    const { connection } = await this.biConnectionService.getBankConnectionByAccountId(bankAccountId);
    const refId = connection.id.toString();
    const bankConnection = await this.bankConnectionRepository.findBy({ refId });
    return bankConnection;
  }
}
