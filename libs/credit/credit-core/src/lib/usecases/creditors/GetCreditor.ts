import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { RbacError } from '../../domain/models';
import { Creditor } from '../../domain/entities';
import { CreditorRepository } from '../../domain/repositories';

export interface GetCreditorCommand {
  uid: string;
}

@injectable()
export class GetCreditor implements Usecase<GetCreditorCommand, Creditor> {
  constructor(
    @inject(CreditIdentifiers.creditorRepository) private readonly creditorRepository: CreditorRepository,
  ) {}

  async execute(request: GetCreditorCommand): Promise<Creditor> {
    return this.creditorRepository.findBy(request.uid);
  }

  async canExecute(identity: Identity): Promise<boolean> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.credit);
    if (roles.permissions.read !== Authorization.self) {
      throw new RbacError.UserCannotRead(
        `user ${identity.uid} not allowed to write on ${ServiceName.credit}`,
      );
    }
    return true;
  }
}
