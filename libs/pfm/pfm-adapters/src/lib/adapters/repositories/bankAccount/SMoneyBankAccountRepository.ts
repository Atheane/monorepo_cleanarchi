import { AxiosHttpMethod, httpBuilder, IHttpBuilder } from '@oney/http';
import { Logger, SymLogger } from '@oney/logger-core';
import { BankAccount, BankAccountRepository, PfmIdentifiers, IAppConfiguration } from '@oney/pfm-core';
import { injectable, inject } from 'inversify';
import { SMoneyBankAccount } from '../../models/bankAccount/BankAccount';
import { BankAccountSMoneyMapper } from '../../mappers/BankAccountSMoneyMapper';

@injectable()
export class SMoneyBankAccountRepository implements BankAccountRepository {
  private readonly connection: IHttpBuilder;

  constructor(
    @inject(PfmIdentifiers.mappers.bankAccountSMoneyMapper)
    private readonly bankAccountSMoneyMapper: BankAccountSMoneyMapper,
    @inject(SymLogger)
    private readonly logger: Logger,
    @inject(PfmIdentifiers.configuration)
    private readonly config: IAppConfiguration,
  ) {
    const httpService = new AxiosHttpMethod();
    this.connection = httpBuilder<AxiosHttpMethod>(httpService)
      .setBaseUrl(this.config.smoneyConfig.baseUrl)
      .setDefaultHeaders({
        Authorization: `Bearer ${this.config.smoneyConfig.token}`,
      });
  }

  async getAll(userId: string): Promise<BankAccount[]> {
    try {
      const smoneyAccounts = await this.connection.get<SMoneyBankAccount>(`/users/${userId}`).execute();
      return this.bankAccountSMoneyMapper.toDomain(smoneyAccounts.data);
    } catch (e) {
      /* istanbul ignore next */
      this.logger.error('@oney/pfm.SMoneyBankAccountRepository.getAll.catch', e?.response?.data);
      return [];
    } finally {
      this.logger.info('@oney/pfm.SMoneyBankAccountRepository.getAll.catch', userId);
    }
  }
}
