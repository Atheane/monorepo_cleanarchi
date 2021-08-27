import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import { ServiceName, Authorization, Identity } from '@oney/identity-core';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import { BankAccountService } from '../../domain/services/BankAccountService';
import { BankAccount } from '../../domain/entities/BankAccount';
import { RbacError } from '../../domain/models';

export interface GetAllBankAccountsCommands {
  userToken: string;
  userId: string;
}

@injectable()
export class GetAllBankAccounts implements Usecase<GetAllBankAccountsCommands, BankAccount[]> {
  constructor(
    @inject(PfmIdentifiers.bankAccountsService)
    private readonly bankAccountsService: BankAccountService,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {}

  execute(request: GetAllBankAccountsCommands): Promise<BankAccount[]> {
    // this.logger.addTag(this.constructor.name);
    const { userToken, userId } = request;
    try {
      return this.bankAccountsService.getBankAccounts(userId, userToken);
    } finally {
      this.logger.info('@oney/pfm.GetAllTransactions.execute.finally', { userId });
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
