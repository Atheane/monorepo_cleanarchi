import { DomainEventHandler } from '@oney/ddd';
import { UpdateProfileEligibility } from '@oney/profile-core';
import { AccountEligibilityCalculated } from '@oney/cdp-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class AccountEligibilityCalculatedEventHandler extends DomainEventHandler<
  AccountEligibilityCalculated
> {
  constructor(
    private readonly updateProfileEligibility: UpdateProfileEligibility,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: AccountEligibilityCalculated): Promise<void> {
    this._logger.info(`handling AccountEligibilityCalculated event`, domainEvent);
    await this.updateProfileEligibility.execute(domainEvent.props);
  }
}
