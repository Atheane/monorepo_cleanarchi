import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { ServiceName, Authorization, Identity } from '@oney/identity-core';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import { AccountStatementRepository, AccountStatementProperties, RbacError } from '../../domain';

export interface GetListAccountStatementsCommands {
  userId: string;
}

@injectable()
export class GetListAccountStatements
  implements Usecase<GetListAccountStatementsCommands, AccountStatementProperties[]> {
  constructor(
    @inject(PfmIdentifiers.accountStatementRepository)
    private readonly accountStatementRepository: AccountStatementRepository,
  ) {}

  async execute(request: GetListAccountStatementsCommands): Promise<AccountStatementProperties[]> {
    await this.accountStatementRepository.getListByUserId(request.userId);
    // TODO remove this after the feature was test
    return [];
  }

  canExecute(identity: Identity): boolean {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.pfm);
    if (roles.permissions.read !== Authorization.self) {
      throw new RbacError.UserCannotRead(`user ${identity.uid} not allowed to read on ${ServiceName.pfm}`);
    }
    return true;
  }
}
