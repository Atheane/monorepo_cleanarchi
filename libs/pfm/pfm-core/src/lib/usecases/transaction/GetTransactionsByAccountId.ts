import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import { ServiceName, Authorization, Identity } from '@oney/identity-core';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import { TransactionService } from '../../domain/services/TransactionService';
import { TransactionQuery } from '../../domain/valueobjects/transaction/TransactionQuery';
import { Transaction } from '../../domain/entities/Transaction';
import { RbacError } from '../../domain/models';

export interface GetTransactionsByAccountIdCommands {
  accountId: string;
  userId: string;
  userToken: string;
  query?: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
}

@injectable()
export class GetTransactionsByAccountId
  implements Usecase<GetTransactionsByAccountIdCommands, Transaction[]> {
  constructor(
    @inject(PfmIdentifiers.transactionsService)
    private readonly transactionsService: TransactionService,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {}

  async execute(request: GetTransactionsByAccountIdCommands): Promise<Transaction[]> {
    // this.logger.addTag(this.constructor.name);
    const { userToken, userId, query, accountId } = request;
    try {
      const options = await new TransactionQuery(query).validate();
      return this.transactionsService.getTransactionsByAccountId({
        accountId,
        userId,
        userToken,
        options,
      });
    } catch (e) {
      this.logger.error('@oney/pfm.GetTransactionsByAccountId.execute.catch', e);
      throw e;
    } finally {
      this.logger.info('@oney/pfm.GetTransactionsByAccountId.execute.finally', { userId, accountId, query });
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
