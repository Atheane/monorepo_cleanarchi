import { AxiosHttpMethod, httpBuilder, IHttpBuilder } from '@oney/http';
import { Logger, SymLogger } from '@oney/logger-core';
import { BankAccountRepository, BankAccount, PfmIdentifiers, IAppConfiguration } from '@oney/pfm-core';
import { injectable, inject } from 'inversify';
import { AggregationAccount } from '../../models/bankAccount/BankAccount';
import { BankAccountAggregationMapper } from '../../mappers/BankAccountAggregationMapper';

export type AggregationFlowResponse = {
  auth_token: string;
};

@injectable()
export class AggregationBankAccountRepository implements BankAccountRepository {
  private readonly connection: IHttpBuilder;

  private readonly baseUrl: string;

  constructor(
    @inject(PfmIdentifiers.mappers.bankAccountAggregationMapper)
    private readonly bankAccountAggregationMapper: BankAccountAggregationMapper,
    @inject(SymLogger)
    private readonly logger: Logger,
    @inject(PfmIdentifiers.configuration)
    private readonly config: IAppConfiguration,
  ) {
    this.baseUrl = this.config.aggregationBaseUrl;
    const httpService = new AxiosHttpMethod();
    this.connection = httpBuilder<AxiosHttpMethod>(httpService).setBaseUrl(this.baseUrl);
  }

  async getAll(userId: string, userToken: string): Promise<BankAccount[]> {
    // this.logger.addTag(`${this.constructor.name}.getAll`);
    try {
      const resultAccounts = await this.connection
        .setDefaultHeaders({
          Authorization: `Bearer ${userToken}`,
        })
        .get<AggregationAccount[]>(`/users/${userId}/accounts`)
        .execute();
      const aggregationAccounts = resultAccounts.data.map(account =>
        this.bankAccountAggregationMapper.toDomain(account),
      );
      return aggregationAccounts;
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator, same below */
      this.logger.error('getAll:', e?.response?.data);
      return [];
    } finally {
      this.logger.info('@oney/pfm.AggregationBankAccountRepository.getAll.finally', { userId, userToken });
    }
  }
}
