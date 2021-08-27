import { Usecase } from '@oney/ddd';
import { BankAccountRepositoryRead } from '@oney/payment-core';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { StorageGateway } from '../../domain/gateways/StorageGateway';

export class GetBankIdentityStatementRequest {
  uid: string;
}

@injectable()
export class GetBankIdentityStatement implements Usecase<GetBankIdentityStatementRequest, Buffer> {
  constructor(
    @inject(PaymentIdentifier.storageGateway) private readonly _storageGateway: StorageGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
  ) {}

  async execute(request: GetBankIdentityStatementRequest): Promise<Buffer> {
    const { uid } = request;
    const bankAccount = await this._bankAccountRepositoryRead.findById(uid);
    return this._storageGateway.getBankIdentityStatement(uid, bankAccount.props.bankAccountId);
  }

  canExecute(identity: Identity): boolean {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.payment);
    return roles.permissions.read === Authorization.self;
  }
}
