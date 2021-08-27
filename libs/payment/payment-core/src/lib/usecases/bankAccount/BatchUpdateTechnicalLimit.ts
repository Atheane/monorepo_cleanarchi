import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { BankAccountRepositoryRead } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { UpdateTechnicalLimit } from '../limits/UpdateTechnicalLimit';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccount } from '../../domain/aggregates/BankAccount';

@injectable()
export class BatchUpdateTechnicalLimit implements Usecase<void, BankAccount[]> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(UpdateTechnicalLimit)
    private readonly updateTechnicalLimit: UpdateTechnicalLimit,
    @inject(SymLogger) private readonly logger: Logger,
  ) {}

  async execute(): Promise<BankAccount[]> {
    const bankAccountsToUseForUpdate = await this._bankAccountRepositoryRead.getAll();
    const accountsUids = bankAccountsToUseForUpdate.map(account => account.props.uid);
    this.logger.info(
      `BatchUpdateTechnicalLimit picked accounts ${accountsUids.length} uids: [${accountsUids}]`,
    );

    this.logger.info(`BatchUpdateTechnicalLimit start updateTechnicalLimit process...`);
    const batchProcess = bankAccountsToUseForUpdate.map(account => {
      return this.updateTechnicalLimit.execute({ uid: account.props.uid });
    });

    const results = await Promise.allSettled(batchProcess);
    const successedResults = results.filter(
      (result): result is PromiseFulfilledResult<BankAccount> => result.status === 'fulfilled',
    );

    const successBankAccounts = successedResults.map(result => result.value);
    const successBankAccountsUids = successBankAccounts.map(account => account.props.uid);

    this.logger.info(
      `BatchUpdateTechnicalLimit ${successBankAccountsUids.length} success uids: [${successBankAccountsUids}]`,
    );
    return successBankAccounts;
  }
}
