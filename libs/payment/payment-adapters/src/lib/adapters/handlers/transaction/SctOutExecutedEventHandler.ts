import { DomainEventHandler } from '@oney/ddd';
import {
  NotifyUpdateBankAccount,
  PaymentIdentifier,
  CalculateBankAccountExposure,
  UpdateMonthlyAllowance,
} from '@oney/payment-core';
import { Logger, SymLogger } from '@oney/logger-core';
import { SctOutExecuted } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';

@injectable()
export class SctOutExecutedEventHandler extends DomainEventHandler<SctOutExecuted> {
  private readonly handlerName: string;
  constructor(
    @inject(UpdateMonthlyAllowance)
    private readonly _updateMonthlyAllowance: UpdateMonthlyAllowance,
    @inject(PaymentIdentifier.notifyUpdateBankAccount)
    private readonly _notifyUpdateBankAccount: NotifyUpdateBankAccount,
    @inject(CalculateBankAccountExposure)
    private readonly calculateBankAccountExposure: CalculateBankAccountExposure,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle({ props: { details } }: SctOutExecuted): Promise<void> {
    this.logger.info(`${this.handlerName}: received event with event properties: ${details}`);
    const { AppAccountId: uid } = details.AccountId;

    this.logger.info(`${this.handlerName}: executing UpdateMonthlyAllowance usecase for user: ${uid}`);
    const bankAccount = await this._updateMonthlyAllowance.execute({ uid });

    this.logger.info(`${this.handlerName}: executing calculateBankAccountExposure usecase for user: ${uid}`);
    await this.calculateBankAccountExposure.execute({ uid });

    this.logger.info(`${this.handlerName}: dispatching domain event for user ${uid}`);
    await this._notifyUpdateBankAccount.execute(bankAccount);
  }
}
