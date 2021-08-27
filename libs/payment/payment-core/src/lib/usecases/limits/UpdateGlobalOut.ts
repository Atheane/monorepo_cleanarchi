import { Usecase } from '@oney/ddd';
import {
  BankAccount,
  BankAccountGateway,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  GlobalLimits,
  PaymentIdentifier,
  UncappingState,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';

export interface UpdateGlobalOutCommand {
  uid: string;
  eligibility: boolean;
  monthlyGlobalOutAllowance: number;
}

@injectable()
export class UpdateGlobalOut implements Usecase<UpdateGlobalOutCommand, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountGateway)
    private readonly _bankAccountGateway: BankAccountGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
  ) {}

  async execute(command: UpdateGlobalOutCommand): Promise<BankAccount> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(command.uid);

    if (bankAccount.props.uncappingState !== UncappingState.UNCAPPED) {
      const customGlobalOut: GlobalLimits = {
        weeklyAllowance: command.monthlyGlobalOutAllowance,
        monthlyAllowance: command.monthlyGlobalOutAllowance,
        annualAllowance: command.monthlyGlobalOutAllowance * 12,
      };

      bankAccount.updateLimits({ globalOut: customGlobalOut });
      await this._bankAccountGateway.updateLimitInformation(bankAccount.props.uid, bankAccount.props.limits);
      await this._bankAccountRepositoryWrite.save(bankAccount);
    }

    return bankAccount;
  }
}
