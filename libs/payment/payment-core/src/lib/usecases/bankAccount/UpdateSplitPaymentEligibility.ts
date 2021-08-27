import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccountRepositoryWrite } from '../../domain/repository/bankAccounts/BankAccountRepositoryWrite';

export class UpdateSplitPaymentEligibilityCommand {
  uid: string;
  splitPaymentEligibility: boolean;
}

@injectable()
export class UpdateSplitPaymentEligibility implements Usecase<UpdateSplitPaymentEligibilityCommand, void> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute({ splitPaymentEligibility, uid }: UpdateSplitPaymentEligibilityCommand): Promise<void> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(uid);
    const splitPaymentEligibilityIsDifferentThanCurrent =
      splitPaymentEligibility !== bankAccount.getSplitPaymentProductEligibility();

    if (splitPaymentEligibilityIsDifferentThanCurrent) {
      if (splitPaymentEligibility) {
        bankAccount.grantSplitPaymentEligibility();
      } else {
        bankAccount.denySplitPaymentEligibility();
      }

      await this._bankAccountRepositoryWrite.save(bankAccount);
      await this._eventDispatcher.dispatch(bankAccount);
    }
  }
}
