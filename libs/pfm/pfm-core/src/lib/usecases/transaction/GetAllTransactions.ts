import { Logger, SymLogger } from '@oney/logger-core';
import * as _ from 'lodash';
import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { ServiceName, Authorization, Identity } from '@oney/identity-core';
import { TransactionSource } from '@oney/common-core';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import {
  TransactionService,
  BankAccountRepository,
  TransactionQuery,
  Transaction,
  RbacError,
  IAppConfiguration,
} from '../../domain';

export interface GetAllTransactionsCommands {
  userToken: string;
  userId: string;
  query?: {
    dateFrom?: number;
    dateTo?: number;
    sortBy?: string;
    transactionSources?: TransactionSource[];
  };
}

@injectable()
export class GetAllTransactions implements Usecase<GetAllTransactionsCommands, Transaction[]> {
  constructor(
    @inject(PfmIdentifiers.transactionsService)
    private readonly transactionsService: TransactionService,
    @inject(PfmIdentifiers.aggregationBankAccountRepository)
    private readonly aggregationBankAccountRepository: BankAccountRepository,
    @inject(SymLogger)
    private readonly logger: Logger,
    @inject(PfmIdentifiers.configuration) private readonly configuration: IAppConfiguration,
  ) {}

  async execute(request: GetAllTransactionsCommands): Promise<Transaction[]> {
    const { userToken, userId, query } = request;
    // this.logger.addTag(this.constructor.name);
    try {
      let accountsIds: string[] = [];
      if (this.configuration.featureFlagAggregation) {
        const userAccounts = await this.aggregationBankAccountRepository.getAll(userId, userToken);
        accountsIds = userAccounts.map(account => account.id);
      }
      const options = await new TransactionQuery(_.pick(query, ['dateFrom', 'dateTo', 'sortBy'])).validate();
      return this.transactionsService.getAllTransactions({
        accountsIds,
        userId,
        userToken,
        options,
        transactionSources: query?.transactionSources,
      });
    } catch (e) {
      this.logger.error('@oney/pfm.GetAllTransactions.execute.catch', e);
      throw e;
    } finally {
      this.logger.info('@oney/pfm.GetAllTransactions.execute.finally', { userId, query });
    }
  }

  canExecute(identity: Identity): boolean {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.pfm);
    if (roles.permissions.read !== Authorization.self) {
      throw new RbacError.UserCannotRead(`user ${identity.uid} not allowed to read on ${ServiceName.pfm}`);
    }
    return true;
  }
}
