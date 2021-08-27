import { DomainEventHandler } from '@oney/ddd';
import {
  NotifyUpdateBankAccount,
  PaymentIdentifier,
  CalculateBankAccountExposure,
  UpdateMonthlyAllowance,
} from '@oney/payment-core';
import { CardTransactionReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class CardTransactionReceivedEventHandler extends DomainEventHandler<CardTransactionReceived> {
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

  async handle({ props: { details } }: CardTransactionReceived): Promise<void> {
    this.logger.info(`${this.handlerName}: received event CARD_TRANSACTION_RECEIVED`);
    const { AppAccountId: uid } = details.AccountId;

    this.logger.info(`${this.handlerName}: executing UpdateMonthlyAllowance usecase for user: ${uid}`);
    const bankAccount = await this._updateMonthlyAllowance.execute({ uid });

    this.logger.info(`${this.handlerName}: executing calculateBankAccountExposure usecase for user: ${uid}`);
    await this.calculateBankAccountExposure.execute({ uid });

    this.logger.info(`${this.handlerName}: dispatching domain event for user ${uid}`);
    await this._notifyUpdateBankAccount.execute(bankAccount);
  }
}
