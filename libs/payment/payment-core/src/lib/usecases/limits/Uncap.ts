import { Usecase } from '@oney/ddd';
import {
  BankAccount,
  BankAccountGateway,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  GetProfileInformationGateway,
  GlobalLimits,
  PaymentIdentifier,
  UncappingReason,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { ProfileStatus } from '@oney/profile-messages';
import { Logger, SymLogger } from '@oney/logger-core';

export interface UncapCommand {
  uid: string;
  eligibility: boolean;
  monthlyGlobalOutAllowance: number;
  reason: UncappingReason;
}

@injectable()
export class Uncap implements Usecase<UncapCommand, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountGateway)
    private readonly _bankAccountGateway: BankAccountGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(PaymentIdentifier.getProfileInformationGateway)
    private readonly _getProfileInformationGateway: GetProfileInformationGateway,
    @inject(PaymentIdentifier.uncappedBalanceLimitConfiguration)
    private readonly _uncappedBalanceLimit: number,
    @inject(SymLogger)
    private readonly _logger: Logger,
  ) {}

  async execute(command: UncapCommand): Promise<BankAccount> {
    this._logger.info(`Stating Uncapping limits for account ID ${command.uid}`);
    const bankAccount = await this._bankAccountRepositoryRead.findById(command.uid);

    if (command.eligibility === true) {
      bankAccount.calculateTechnicalLimit(command.monthlyGlobalOutAllowance);
      this._logger.info(
        `The following technicalLimit has been defined for account ID ${command.uid}`,
        bankAccount.props.limits.props.technicalLimit,
      );

      const globalOut: GlobalLimits = {
        weeklyAllowance: command.monthlyGlobalOutAllowance,
        monthlyAllowance: command.monthlyGlobalOutAllowance,
        annualAllowance: bankAccount.props.limits.props.globalOut.annualAllowance,
      };
      bankAccount.uncap(command.reason, globalOut, this._uncappedBalanceLimit);
      this._logger.info(`globalOut defined for account ID ${command.uid}`, globalOut);
      this._logger.info(`balanceLimit defined for account ID ${command.uid}`, this._uncappedBalanceLimit);

      const profileInfos = await this._getProfileInformationGateway.getById(command.uid);
      if (profileInfos.informations.status === ProfileStatus.ACTIVE) {
        this._logger.info(`Sending limits to SMO for account ID ${command.uid}`);
        await this._bankAccountGateway.updateLimitInformation(command.uid, bankAccount.props.limits);
      }
    } else {
      bankAccount.rejectUncapping(command.reason);
    }
    await this._bankAccountRepositoryWrite.save(bankAccount);
    this._logger.info(`Limits has been saved for account ID ${command.uid}`);

    return bankAccount;
  }
}
