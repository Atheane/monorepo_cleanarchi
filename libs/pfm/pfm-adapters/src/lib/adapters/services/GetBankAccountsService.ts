import { injectable, inject } from 'inversify';
import { BankAccount, BankAccountService, PfmIdentifiers, IAppConfiguration } from '@oney/pfm-core';
import { SMoneyBankAccountRepository } from '../repositories/bankAccount/SMoneyBankAccountRepository';
import { AggregationBankAccountRepository } from '../repositories/bankAccount/AggregationBankAccountRepository';

@injectable()
export class GetBankAccountsService implements BankAccountService {
  constructor(
    @inject(PfmIdentifiers.smoneyBankAccountRepository)
    private readonly smoneyBankAccountRepository: SMoneyBankAccountRepository,
    @inject(PfmIdentifiers.aggregationBankAccountRepository)
    private readonly aggregationBankAccountRepository: AggregationBankAccountRepository,
    @inject(PfmIdentifiers.configuration) private readonly configuration: IAppConfiguration,
  ) {}

  async getBankAccounts(userId: string, userToken: string): Promise<BankAccount[]> {
    const smoneyBankAccounts = await this.smoneyBankAccountRepository.getAll(userId);
    let aggregationBankAccounts: BankAccount[] = [];
    if (this.configuration.featureFlagAggregation) {
      aggregationBankAccounts = await this.aggregationBankAccountRepository.getAll(userId, userToken);
    }
    return [...smoneyBankAccounts, ...aggregationBankAccounts];
  }
}
