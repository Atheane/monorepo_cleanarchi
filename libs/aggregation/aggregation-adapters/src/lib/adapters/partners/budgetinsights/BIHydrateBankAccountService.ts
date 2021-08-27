import { inject, injectable } from 'inversify';
import {
  OwnerIdentity,
  AggregationIdentifier,
  HydrateBankAccountService,
  Transaction,
} from '@oney/aggregation-core';
import { BIConnectionService } from './BIConnectionService';
import { OwnerIdentityMapper } from '../../mappers/OwnerIdentityMapper';
import { BudgetInsightTransactionMapper } from '../../mappers/BudgetInsightTransactionMapper';

@injectable()
export class BIHydrateBankAccountService implements HydrateBankAccountService {
  constructor(
    private readonly biConnectionService: BIConnectionService,
    @inject(AggregationIdentifier.budgetInsightTransactionMapper)
    private readonly transactionMapper: BudgetInsightTransactionMapper,
    @inject(AggregationIdentifier.ownerIdentityMapper)
    private readonly ownerIdentityMapper: OwnerIdentityMapper,
  ) {}

  async getOwnerIdentity(connectionRefId: string): Promise<OwnerIdentity> {
    const result = await this.biConnectionService.getOwnerIdentity(connectionRefId);
    return this.ownerIdentityMapper.toDomain(result);
  }

  async getBankAccountTransactions(accountId: string): Promise<Transaction[]> {
    const { transactions } = await this.biConnectionService.getTransactionsByAccountId(accountId);
    return transactions.map(t => this.transactionMapper.toDomain(t));
  }
}
