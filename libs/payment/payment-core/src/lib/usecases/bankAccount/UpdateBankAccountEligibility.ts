import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { BankAccount, BankAccountRepositoryWrite } from '@oney/payment-core';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';

export class UpdateBankAccountEligibilityRequest {
  uid: string;
  accountEligibility: boolean;
}

@injectable()
export class UpdateBankAccountEligibility
  implements Usecase<UpdateBankAccountEligibilityRequest, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: UpdateBankAccountEligibilityRequest): Promise<BankAccount> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.uid);
    if (!request.accountEligibility || bankAccount.isEligibleForAccountProduct()) {
      return bankAccount;
    }

    bankAccount.grantAccountEligibility(request.accountEligibility);

    await this._bankAccountRepositoryWrite.save(bankAccount);
    await this._eventDispatcher.dispatch(bankAccount);
    return bankAccount;
  }
}
