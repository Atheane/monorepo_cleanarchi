import { DomainEventHandler } from '@oney/ddd';
import {
  NotifyUpdateBankAccount,
  UpdateMonthlyAllowance,
  PaymentIdentifier,
  CalculateBankAccountExposure,
} from '@oney/payment-core';
import { PaymentCreated } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class PaymentCreatedEventHandler extends DomainEventHandler<PaymentCreated> {
  private handlerName: string;
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

  async handle({ props }: PaymentCreated): Promise<void> {
    this.logger.info(`${this.handlerName}: received event with event properties`, props);
    const { uid } = props.sender;
    const { uid: beneficiaryUid } = props.beneficiary;

    this.logger.info(`${this.handlerName}: executing UpdateMonthlyAllowance usecase for user: ${uid}`);
    const bankAccount = await this._updateMonthlyAllowance.execute({ uid });

    this.logger.info(
      `${this.handlerName}: executing calculateBankAccountExposure usecase for sender user: ${uid}`,
    );
    await this.calculateBankAccountExposure.execute({ uid });

    this.logger.info(
      `${this.handlerName}: executing calculateBankAccountExposure usecase for beneciary user: ${beneficiaryUid}`,
    );
    await this.calculateBankAccountExposure.execute({ uid: beneficiaryUid });

    await this._notifyUpdateBankAccount.execute(bankAccount);
  }
}
