import { Usecase } from '@oney/ddd';
import { EventDispatcher, EventProducerDispatcher } from '@oney/messages-core';
import { EvaluateBankAccountToUncapLimits } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { AccountIncomeVerification } from '@oney/cdp-messages';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccountRepositoryWrite } from '../../domain/repository/bankAccounts/BankAccountRepositoryWrite';
import { UncappingReason } from '../../domain/valueobjects/bankAccount/UncappingReason';

export interface CheckToEvaluateAccountCommand {
  uid: string;
  aggregatedAccounts: Array<AccountIncomeVerification>;
}

@injectable()
export class CheckToEvaluateAccount implements Usecase<CheckToEvaluateAccountCommand, void> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    private readonly _eventDispatcher: EventDispatcher,
    private readonly _eventProducerDispatcher: EventProducerDispatcher,
  ) {}

  async execute(command: CheckToEvaluateAccountCommand): Promise<void> {
    const { uid, aggregatedAccounts } = command;
    const hasAtLeastOneAccountWithIncome: boolean = aggregatedAccounts.some(result => result.valid === true);
    if (hasAtLeastOneAccountWithIncome) {
      const event = new EvaluateBankAccountToUncapLimits({ uid });
      await this._eventDispatcher.dispatch(event);
    } else {
      const bankAccount = await this._bankAccountRepositoryRead.findById(uid);
      bankAccount.rejectUncapping(UncappingReason.AGGREGATION);
      await this._eventProducerDispatcher.dispatch(bankAccount);
    }
  }
}
