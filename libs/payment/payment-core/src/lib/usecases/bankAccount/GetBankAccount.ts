import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { BankAccountError } from '../../models/errors/PaymentErrors';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccount } from '../../domain/aggregates/BankAccount';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccountGateway } from '../../domain/gateways/BankAccountGateway';
import { BankAccountRepositoryWrite } from '../../domain/repository/bankAccounts/BankAccountRepositoryWrite';

export interface GetBankAccountRequest {
  uid: string;
}

@injectable()
export class GetBankAccount implements Usecase<GetBankAccountRequest, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountGateway) private readonly _bankAccountGateway: BankAccountGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
  ) {}

  async execute(request: GetBankAccountRequest): Promise<BankAccount> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.uid);
    if (!bankAccount) {
      throw new BankAccountError.BankAccountNotFound('Bank account not found');
    }

    if (bankAccount.props.monthlyAllowance && bankAccount.props.monthlyAllowance.authorizedAllowance === 0) {
      const {
        monthlyUsedAllowance,
        authorizedAllowance,
        remainingFundToSpend,
      } = await this._bankAccountGateway.getCalculatedMonthlyAllowance(request.uid);
      bankAccount.updateMonthlyAllowance({ authorizedAllowance, remainingFundToSpend }, monthlyUsedAllowance);
      await this._bankAccountRepositoryWrite.save(bankAccount);
    }

    return bankAccount;
  }

  async canExecute(identity: Identity, request: GetBankAccountRequest): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.payment);
    if (!scope) {
      return false;
    }

    if (identity.uid === request.uid && scope.permissions.read === Authorization.self) {
      return true;
    }

    if (
      [ServiceName.profile.valueOf()].includes(identity.uid) &&
      scope.permissions.read === Authorization.all
    ) {
      return true;
    }

    return false;
  }
}
