import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { injectable, inject } from 'inversify';
import {
  BankAccount,
  BankAccountGateway,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  GetProfileInformationGateway,
  GlobalLimits,
  LimitInformationProperties,
  PaymentIdentifier,
} from '@oney/payment-core';
import { ProfileStatus } from '@oney/profile-messages';
import { Logger, SymLogger } from '@oney/logger-core';

export interface InitiateLimitsCommand {
  uid: string;
  balanceLimit: number;
  globalOutMonthlyAllowance: number;
  eligibility: boolean;
}

@injectable()
export class InitiateLimits implements Usecase<InitiateLimitsCommand, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(PaymentIdentifier.bankAccountGateway)
    private readonly _bankAccountGateway: BankAccountGateway,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(PaymentIdentifier.getProfileInformationGateway)
    private readonly _getProfileInformationGateway: GetProfileInformationGateway,
    @inject(PaymentIdentifier.globalInConfiguration)
    private readonly _globalIn: GlobalLimits,
    @inject(PaymentIdentifier.globalOutAnnualAllowanceConfiguration)
    private readonly _globalOutAnnualAllowance: number,
    @inject(SymLogger)
    private readonly _logger: Logger,
  ) {}

  async execute(command: InitiateLimitsCommand): Promise<BankAccount> {
    this._logger.info(`Stating Initializing limits for account ID ${command.uid}`);
    if (!command.eligibility) {
      return null;
    }
    const bankAccount: BankAccount = await this._bankAccountRepositoryRead.findById(command.uid);
    const limits: LimitInformationProperties = {
      balanceLimit: command.balanceLimit,
      globalIn: this._globalIn,
      globalOut: {
        weeklyAllowance: command.globalOutMonthlyAllowance,
        monthlyAllowance: command.globalOutMonthlyAllowance,
        annualAllowance: this._globalOutAnnualAllowance,
      },
    };
    this._logger.info(`Limits defined for account ID ${command.uid}`, limits);
    bankAccount.initLimits(limits);

    const profileInfos = await this._getProfileInformationGateway.getById(command.uid);
    if (profileInfos.informations.status === ProfileStatus.ACTIVE) {
      this._logger.info(`Sending limits to SMO for account ID ${command.uid}`);
      await this._bankAccountGateway.updateLimitInformation(command.uid, bankAccount.props.limits);
    }

    await this._bankAccountRepositoryWrite.save(bankAccount);
    await this._eventDispatcher.dispatch(bankAccount);
    this._logger.info(`Limits has been saved for account ID ${command.uid}`, limits);

    return bankAccount;
  }
}
