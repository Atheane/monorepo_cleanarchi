import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { ServiceName, Authorization, Identity } from '@oney/identity-core';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import { TransactionService } from '../../domain/services/TransactionService';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionError } from '../../domain/models/PfmErrors';
import { RbacError } from '../../domain/models';

export interface GetTransactionsByIdCommand {
  userId: string;
  userToken: string;
  transactionId: string;
}

@injectable()
export class GetTransactionById implements Usecase<GetTransactionsByIdCommand, Transaction> {
  constructor(
    @inject(PfmIdentifiers.transactionsService)
    private readonly transactionsService: TransactionService,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {}

  async execute(request: GetTransactionsByIdCommand): Promise<Transaction> {
    // this.logger.addTag(this.constructor.name);
    const { userId, userToken, transactionId } = request;
    try {
      const transaction: Transaction = await this.transactionsService.getTransactionById({
        userId,
        userToken,
        transactionId,
      });
      if (!transaction) {
        throw new TransactionError.TransactionNotFound('TRANSACTION_NOT_FOUND');
      }
      return transaction;
    } catch (e) {
      this.logger.error('@oney/pfm.GetTransactionById.execute.catch', e);
      throw e;
    } finally {
      this.logger.info('@oney/pfm.GetTransactionById.execute.finally', { userId, transactionId });
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
