import { AxiosHttpMethod, httpBuilder, IHttpBuilder } from '@oney/http';
import { Logger, SymLogger } from '@oney/logger-core';
import {
  Transaction,
  TransactionRepository,
  TransactionQueryType,
  PfmIdentifiers,
  IAppConfiguration,
} from '@oney/pfm-core';
import { injectable, inject } from 'inversify';
import { SMoneyTransaction } from '../../models/transaction/SMoney';
import { SMoneyBankAccountRepository } from '../bankAccount/SMoneyBankAccountRepository';
import { TransactionSMoneyMapper } from '../../mappers/TransactionSMoneyMapper';

@injectable()
export class SMoneyTransactionRepository implements TransactionRepository {
  private readonly connection: IHttpBuilder;

  constructor(
    @inject(PfmIdentifiers.mappers.transactionSMoneyMapper)
    private readonly transactionSMoneyMapper: TransactionSMoneyMapper,
    @inject(PfmIdentifiers.smoneyBankAccountRepository)
    private readonly smoneyBankAccountRepository: SMoneyBankAccountRepository,
    @inject(SymLogger)
    private readonly logger: Logger,
    @inject(PfmIdentifiers.configuration)
    private readonly config: IAppConfiguration,
  ) {
    const httpService = new AxiosHttpMethod();
    this.connection = httpBuilder<AxiosHttpMethod>(httpService).setBaseUrl(
      this.config.transactionConfig.baseUrl,
    );
  }

  async getByAccountId({
    accountId: userId,
    userToken,
    options,
  }: {
    accountId: string;
    userToken?: string;
    options?: TransactionQueryType;
  }): Promise<Transaction[]> {
    try {
      let queryParams = '';
      if (options) {
        const { sortBy, dateFrom, dateTo } = options;
        queryParams = `?sortBy=date;${sortBy}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      }
      const result = await this.connection
        .setDefaultHeaders({ Authorization: `Bearer ${userToken}` })
        .get<SMoneyTransaction[]>(`/user/${userId}/transactions${queryParams}`)
        .execute();

      const accounts = await this.smoneyBankAccountRepository.getAll(userId);
      return result.data.map(raw => this.transactionSMoneyMapper.toDomain({ accounts, raw }));
    } catch (e) {
      // this.logger.addTag(`${this.constructor.name}.getByAccountId`);
      /* istanbul ignore next */
      this.logger.error(`getByAccountId: ${e?.response?.data?.code}`, e?.response?.data || e);
      return [];
    }
  }

  async getByTransactionId({
    userId,
    userToken,
    transactionId,
  }: {
    userId: string;
    userToken: string;
    transactionId: string;
  }): Promise<Transaction> {
    try {
      const result = await this.connection
        .setDefaultHeaders({ Authorization: `Bearer ${userToken}` })
        .get<SMoneyTransaction>(`/user/${userId}/transaction/${transactionId}`)
        .execute();
      const accounts = await this.smoneyBankAccountRepository.getAll(userId);
      return this.transactionSMoneyMapper.toDomain({
        accounts,
        raw: result.data,
      });
    } catch (e) {
      return null;
    }
  }
}
