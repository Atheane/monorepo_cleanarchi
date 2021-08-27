import { Usecase } from '@oney/ddd';
import { BankAccountGateway, BankAccountRepositoryRead, PaymentIdentifier } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

export interface ApplyLocalLimitsCommand {
  uid: string;
}

@injectable()
export class ApplyLocalLimits implements Usecase<ApplyLocalLimitsCommand, void> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountGateway) private readonly _bankAccountGateway: BankAccountGateway,
    @inject(SymLogger)
    private readonly _logger: Logger,
  ) {}

  async execute(command: ApplyLocalLimitsCommand): Promise<void> {
    this._logger.info(`Sending limits to SMO for account ID ${command.uid}`);
    const bankAccount = await this._bankAccountRepositoryRead.findById(command.uid);
    await this._bankAccountGateway.updateLimitInformation(command.uid, bankAccount.props.limits);
    this._logger.info(`limits has been sent to SMO for account ID ${command.uid}`);
  }
}
