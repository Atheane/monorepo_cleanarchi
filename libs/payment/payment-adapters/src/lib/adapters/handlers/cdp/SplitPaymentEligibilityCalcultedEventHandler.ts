import { DomainEventHandler } from '@oney/ddd';
import { CalculateBankAccountExposure, UpdateSplitPaymentEligibility } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { X3X4EligibilityCalculated } from '@oney/cdp-messages';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class SplitPaymentEligibilityCalcultedEventHandler extends DomainEventHandler<
  X3X4EligibilityCalculated
> {
  private readonly handlerName: string;
  constructor(
    @inject(UpdateSplitPaymentEligibility)
    private readonly updateSplitPaymentEligibility: UpdateSplitPaymentEligibility,
    @inject(CalculateBankAccountExposure)
    private readonly calculateBankAccountExposure: CalculateBankAccountExposure,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle({ props: { uId: uid, eligibility } }: X3X4EligibilityCalculated): Promise<void> {
    this.logger.info(`${this.handlerName}: received event for uid: ${uid}, eligibility: ${eligibility}`);
    await this.updateSplitPaymentEligibility.execute({
      uid,
      splitPaymentEligibility: eligibility,
    });
    await this.calculateBankAccountExposure.execute({ uid });
  }
}
