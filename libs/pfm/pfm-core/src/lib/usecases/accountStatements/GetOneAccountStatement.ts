import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { ServiceName, Authorization, Identity } from '@oney/identity-core';
import { AccountStatementService } from '../../domain/services';
import { PfmIdentifiers } from '../../PfmIdentifiers';
import { RbacError } from '../../domain/models';

export interface GetOneAccountStatementCommands {
  userId: string;
  accountStatementId: string;
}

@injectable()
export class GetOneAccountStatement implements Usecase<GetOneAccountStatementCommands, Buffer> {
  constructor(
    @inject(PfmIdentifiers.accountStatementService)
    private readonly accountStatementService: AccountStatementService,
  ) {}

  execute(request: GetOneAccountStatementCommands): Promise<Buffer> {
    return this.accountStatementService.getAccountStatement(
      `bank_statements/${request.userId}/${request.accountStatementId}.pdf`,
    );
  }

  canExecute(identity: Identity): boolean {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.pfm);
    if (roles.permissions.read !== Authorization.self) {
      throw new RbacError.UserCannotRead(`user ${identity.uid} not allowed to read on ${ServiceName.pfm}`);
    }
    return true;
  }
}
