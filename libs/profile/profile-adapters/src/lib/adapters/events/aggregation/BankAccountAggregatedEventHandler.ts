import { ActivateProfileWithAggregation } from '@oney/profile-core';
import { BankAccountAggregated } from '@oney/aggregation-messages';
import { DomainEventHandler } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

/*
 * TODO: migrate to a SAGA whenever they are available
 * startedBy AggregationSucceeded
 * ask ActivateProfile
 * handle ProfileActivated (should be handled locally and not go through the bus)
 * handle KycDiligenceFailed
 * handle KycDiligenceSucceeded
 * markAsComplete
 */

@injectable()
export class BankAccountAggregatedEventHandler extends DomainEventHandler<BankAccountAggregated> {
  constructor(
    private readonly _activateProfileWithAggregation: ActivateProfileWithAggregation,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: BankAccountAggregated): Promise<void> {
    this._logger.info(`handling BankAccountAggregated event`, domainEvent);

    await this._activateProfileWithAggregation.execute({
      userId: domainEvent.props.userId,
      isOwnerBankAccount: domainEvent.props.isOwnerBankAccount,
    });
  }
}
