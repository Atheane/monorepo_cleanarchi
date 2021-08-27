import { DomainEventHandler } from '@oney/ddd';
import { UpdateBankAccountEligibility } from '@oney/payment-core';
import { AccountEligibilityCalculated } from '@oney/cdp-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class AccountEligibilityCalculatedEventHandler extends DomainEventHandler<
  AccountEligibilityCalculated
> {
  constructor(
    @inject(UpdateBankAccountEligibility)
    private readonly _usecase: UpdateBankAccountEligibility,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: AccountEligibilityCalculated): Promise<void> {
    const { uId, eligibility } = domainEvent.props;
    await this._usecase.execute({
      uid: uId,
      accountEligibility: eligibility,
    });
  }
}
