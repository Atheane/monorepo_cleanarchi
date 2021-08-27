import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import {
  BankAccountGateway,
  BankAccountProperties,
  BankAccountRepositoryWrite,
  GetProfileInformationGateway,
  GlobalLimits,
  UncappingReason,
} from '@oney/payment-core';
import { ProfileStatus } from '@oney/profile-messages';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';

export class UncapBankAccountUsingAggregatedAccountsCommand {
  uId: string;
  customBalanceLimitEligibility: boolean;
  customBalanceLimit: number;
}

@injectable()
export class UncapBankAccountUsingAggregatedAccounts
  implements Usecase<UncapBankAccountUsingAggregatedAccountsCommand, BankAccountProperties> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(PaymentIdentifier.bankAccountGateway) private readonly _bankAccountGateway: BankAccountGateway,
    @inject(PaymentIdentifier.getProfileInformationGateway)
    private readonly _getProfileInformationGateway: GetProfileInformationGateway,
  ) {}

  async execute(command: UncapBankAccountUsingAggregatedAccountsCommand): Promise<BankAccountProperties> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(command.uId);
    if (!command.customBalanceLimitEligibility || bankAccount.isUncapped()) {
      return bankAccount.props;
    }

    const profileInfos = await this._getProfileInformationGateway.getById(command.uId);

    const globalOut: GlobalLimits = {
      weeklyAllowance: command.customBalanceLimit,
      monthlyAllowance: command.customBalanceLimit,
      annualAllowance: bankAccount.props.limits.props.globalOut.annualAllowance,
    };

    bankAccount.calculateTechnicalLimit(command.customBalanceLimit);
    bankAccount.uncap(UncappingReason.AGGREGATION, globalOut, command.customBalanceLimit);

    if (profileInfos.informations.status === ProfileStatus.ACTIVE) {
      await this._bankAccountGateway.updateLimitInformation(command.uId, bankAccount.props.limits);
    }

    await this._bankAccountRepositoryWrite.save(bankAccount);
    await this._eventDispatcher.dispatch(bankAccount);
    return bankAccount.props;
  }
}
