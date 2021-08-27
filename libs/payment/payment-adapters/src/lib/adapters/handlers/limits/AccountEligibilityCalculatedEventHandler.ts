import { DomainEventHandler } from '@oney/ddd';
import { AccountEligibilityCalculated } from '@oney/cdp-messages';
import { InitiateLimits, InitiateLimitsCommand } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class AccountEligibilityCalculatedEventHandler extends DomainEventHandler<
  AccountEligibilityCalculated
> {
  private readonly handlerName: string;

  constructor(
    private readonly _initiateLimits: InitiateLimits,
    @inject(SymLogger)
    private readonly _logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle(domainEvent: AccountEligibilityCalculated): Promise<void> {
    this._logger.info(`${this.handlerName}: received event with event properties: `, domainEvent.props);

    const command: InitiateLimitsCommand = {
      uid: domainEvent.props.uId,
      globalOutMonthlyAllowance: domainEvent.props.balanceLimit,
      balanceLimit: domainEvent.props.balanceLimit,
      eligibility: domainEvent.props.eligibility,
    };

    await this._initiateLimits.execute(command);
  }
}
